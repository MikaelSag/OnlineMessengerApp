import uuid
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy.sql import text
from datetime import datetime
from connect import get_db_connection
from models import User, Conversation, Participant, Message

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# request models
class UserRegister(BaseModel):
    email: EmailStr
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class ConversationListRequest(BaseModel):
    user_id: str

# response models
class ConversationResponse(BaseModel):
    conversation_id: str
    username: str

class GetConvoRequest(BaseModel):
    conversation_id: str
    user_id: str

class MessageResponse(BaseModel):
    sender_id: str
    content: str
    delivered_at: str

class GetConvoResponse(BaseModel):
    username: str
    messages: list[MessageResponse]

class MessageSendRequest(BaseModel):
    conversation_id: str
    user_id: str
    content: str

class FriendRequestSendRequest(BaseModel):
    username: str
    user_id: str

class CreateConvoRequest(BaseModel):
    receiver_participant: str
    sender_participant: str

class DeleteConvoRequest(BaseModel):
    conversation_id: str

class ChangePasswordRequest(BaseModel):
    username: str
    old_password: str
    new_password: str

# register
@app.post("/register")
async def register(user: UserRegister, db: Session = Depends(get_db_connection)):
    # check if email or username already exists
    existing_user = db.query(User).filter((User.Email == user.email) | (User.Username == user.username)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email or Username already registered")

    user_id = str(uuid.uuid4())
    new_user = User(UserID=user_id, Email=user.email, Username=user.username, Password=user.password)
    
    db.add(new_user)
    db.commit()
    return {"request_done": True}

# login
@app.post("/login")
async def login(user: UserLogin, db: Session = Depends(get_db_connection)):
    # check if username is valid
    if not user.username or not isinstance(user.username, str):
        raise HTTPException(status_code=400, detail="Invalid username")

    # sql query using prepared statement
    query = text("SELECT * FROM Users WHERE Username = :username AND Password = :password")
    try:
        db_user = db.execute(query, {"username": user.username, "password": user.password}).fetchone()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {str(e)}")
    
    if not db_user:
        return {"login": False}
    
    return {"login": True, "user_id": db_user.UserID, "username": db_user.Username}

@app.post("/unsecureLogin")
async def login(user: UserLogin, db: Session = Depends(get_db_connection)):
    # check if username is valid
    if not user.username or not isinstance(user.username, str):
        raise HTTPException(status_code=400, detail="Invalid username")

    # sql query using prepared statement
    query = text(f"SELECT * FROM Users WHERE Username = '{user.username}' AND Password = '{user.password}'")

    try:
        db_user = db.execute(query).fetchone()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {str(e)}")

    if not db_user:
        return {"login": False}
    
    return {"login": True, "user_id": db_user.UserID, "username": db_user.Username}


# list
@app.post("/list", response_model=list[ConversationResponse])
async def list_conversations(request: ConversationListRequest, db: Session = Depends(get_db_connection)):
    # check if the user exists
    user = db.query(User).filter(User.UserID == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # retrieve all conversations the user participates in
    conversations = (
        db.query(Conversation)
        .join(Participant, Participant.ConversationID == Conversation.ConversationID)
        .filter(Participant.UserID == request.user_id)
        .all()
    )

    response = []

    for conversation in conversations:
        convo = {}
        conversation_id = conversation.ConversationID
        q = text(f"select UserID from participants where ConversationID = '{conversation_id}' and UserID != '{request.user_id}'")
        res = db.execute(q).fetchone()[0]
        convo["conversation_id"] = conversation_id

        q = text(f"select username from users where userid = '{res}'")
        res = db.execute(q).fetchone()[0]
        convo["username"] = res
        
        response.append(convo)

    return response

@app.post("/getConvo", response_model=GetConvoResponse)
async def get_conversation(request: GetConvoRequest, db: Session = Depends(get_db_connection)):
    # check if conversation exists
    conversation = db.query(Conversation).filter(Conversation.ConversationID == request.conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    response = {}
    conversation_id = request.conversation_id
    q = text(f"select UserID from participants where ConversationID = '{conversation_id}' and UserID != '{request.user_id}'")
    res = db.execute(q).fetchone()[0]
    q = text(f"select username from users where userid = '{res}'")
    res = db.execute(q).fetchone()[0]
    response["username"] = res
 
    messages = (
        db.query(Message)
        .filter(Message.ConversationID == request.conversation_id)
        .order_by(Message.Delivered_at)
        .all()
    )

    response["messages"] = [
        {
            "sender_id": message.UserID,
            "content": message.Content,
            "delivered_at": message.Delivered_at.isoformat()
        }
        for message in messages
    ]

    return response


@app.post("/createConvo")
async def create_convo(request: CreateConvoRequest, db:Session = Depends(get_db_connection)):

    try:
        conversation_id = uuid.uuid4()
        new_conversation = Conversation(ConversationID = conversation_id)
        receiver_participant_username = db.query(User).filter(User.Username == request.receiver_participant).first().UserID

        sender_participant = Participant(UserID = request.sender_participant, ConversationID = conversation_id)
        receiver_participant = Participant(UserID = receiver_participant_username, ConversationID = conversation_id )
        db.add(new_conversation)
        db.add_all([ sender_participant, receiver_participant])
        db.commit()

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"An error occurred: {str(e)}")

    return {"created": True, "conversation_id": conversation_id}



@app.post("/sendMessage")
async def send_message(request: MessageSendRequest, db: Session = Depends(get_db_connection)):
    # check if conversation exists
    conversation = db.query(Conversation).filter(Conversation.ConversationID == request.conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # create new message
    new_message = Message(
        MessageID = str(uuid.uuid4()),
        ConversationID = request.conversation_id,
        UserID = request.user_id,
        Content = request.content,
        Delivered_at = datetime.now()
    )

    # add new message to database and update conversation
    db.add(new_message)
    conversation.Last_update = datetime.now()
    db.commit()

    return{"status": True}


# delete conversation
@app.post("/deleteConversation")
async def delete_conversation(request: DeleteConvoRequest, db: Session = Depends(get_db_connection)):
    # check if the conversation exists
    conversation = db.query(Conversation).filter(Conversation.ConversationID == request.conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    db.query(Message).filter(Message.ConversationID == request.conversation_id).delete(synchronize_session=False)


    participants = db.query(Participant).filter(Participant.ConversationID == request.conversation_id).all()
    for participant in participants:
        db.delete(participant)

    db.delete(conversation)
    db.commit()

    return {"request_done": True, "message": "Conversation deleted successfully"}


@app.post("/changePassword")
async def change_password(request: ChangePasswordRequest, db: Session = Depends(get_db_connection)):
    if not request.username or not request.old_password or not request.new_password:
        raise HTTPException(status_code=400, detail="All inputs are required")
    print(request)

    print(f"UPDATE Users SET Password = '{request.new_password}' WHERE Username = '{request.username}' AND Password = '{request.old_password}'")
    query = text(f"UPDATE Users SET Password = '{request.new_password}' WHERE Username = '{request.username}' AND Password = '{request.old_password}'")

    try:
        # check if the user exists
        result = db.execute(query)
        db.commit()

        if result.rowcount == 0:
            return{"success": False, "message": "Invalid username or password"}
        return {"success": True, "message": "Password changed successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"An error occurred: {str(e)}")



