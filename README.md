# Installation

You must install **MySQL** before running the database; configure the root password when prompted. You may also install a third-party database tool to manage the database, if you wish. 
**Python 3.x** must be installed. Ensure that Python’s package manager `pip` is also installed and added to your system’s path. **Node.js** must be installed for your system as well. This should also install `npm`. JavaScript must be enabled in order to run the frontend website. You must use **VS Code**, or a viable alternative, to run the system itself. This guide assumes you are using VS Code.

1. Start the MySQL server on your device, then using your database tool, create a new database and run the `create_db.sql` script within it. This should populate the database with the necessary tables.
2. You must start up the MySQL server for the database to work properly. You can do this in **Windows Services**. Navigate to **MySQL80**, then click on **Start the service**.

![image1](https://github.com/MikaelSag/OnlineMessengerApp/blob/main/images/dbproj1.png?raw=true)

3. After downloading the database files (`db-project`), open it in **VS Code**. Navigate to:

db-project/backend/connect.py

On **line 10**, replace `[Password]` in the `DATABASE_URL` variable with your MySQL root password.  
If your password uses special characters, they will likely need to be replaced using URL encoding.  
Look up the associated hexadecimal code if necessary.

![image2](https://github.com/MikaelSag/OnlineMessengerApp/blob/main/images/dbproj2.png?raw=true)

4. Open **two terminals** — one will be for the frontend, one will be for the backend.

### Backend Terminal

Navigate to the `backend` folder. Using **uvicorn** for the backend, run the following command:

`uvicorn main:app --reload`

Upon success, the following should be output. This means that the backend is now running.

![image3](https://github.com/MikaelSag/OnlineMessengerApp/blob/main/images/dbproj3.png?raw=true)

### Frontend Terminal
Navigate to the frontend folder within the db-project directory. Run the following commands:

`npm install`
Then start the frontend server with:

`npm start`
Upon activating, the a registration page should open in your browser. Otherwise, navigate to:

http://localhost:3000/

# Conceptual Design of Database  

![image1](https://github.com/MikaelSag/OnlineMessengerApp/blob/main/images/image%20(2).png?raw=true)
![image2](https://github.com/MikaelSag/OnlineMessengerApp/blob/main/images/image.png?raw=true)

# Logical Database Schema
### User
* UserID (primary key) → VarChar(50): Stores a user’s unique account ID
* Email (unique) → Text: Stores a user’s unique email address that they registered with. Cannot be null or default (required information)
* Username (unique) → VarChar(30): User’s display name on the chat application. Cannot be null or default (required information)
* Password → VarChar(30): A password associated with a user’s account that they use to access that account. Cannot be null or default (required information)
* Created_at → DateTime: Keeps track of when a user created their account; how old the account is. Defaults to current time (when user’s account is created)
* Last_active → DateTime: The last time there was activity on the account; latest time the user was logged in. Defaults to current time (when user’s account is created)

### Participants
* ParticipantID (foreign key): Stores a reference to the user table. On primary key delete set null
* ConversationID (foreign key): Stores a reference to the conversation table. On primary key delete cascade from primary key
* Joined_at → DateTime: Defaults to current time (when participant joins conversation)
* Primary Key(UserID, ConversationID): A composite key containing the user id and the conversation id. This represents a relationship between Users and Conversations, which is a many to many relationship. Each user can only be part of the same conversation once. 

### Conversations
* ConversationID (primary key) → VarChar(50): Stores a unique identifier for each conversation
* Created_at → DateTime: Defaults to current time (when conversation is created)
* Last_update → DateTime: Defaults to current time (when last message was sent)

### Messages
* MessageID (primary key) → VarChar(50): Stores a unique identifier for each message
* ConversationID (foreign key): Stores a reference to the Conversation that the message belongs to. On delete cascade from primary key
* UserID (foreign key): Stores a reference to the User who sent the message. On primary key delete set null 
* Delivered_at → DateTime: Defaults to current time (when message is sent)
* Content → Text: Defaults to null

# Application Screenshots  

### Registration:
![registration](https://github.com/MikaelSag/OnlineMessengerApp/blob/main/images/dbproj6.png?raw=true)

### Login: 
![login](https://github.com/MikaelSag/OnlineMessengerApp/blob/main/images/dbproj4.png?raw=true)

### Chatting with Other Users
![chatting](https://github.com/MikaelSag/OnlineMessengerApp/blob/main/images/dbproj5.png?raw=true)
