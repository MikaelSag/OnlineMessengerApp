from sqlalchemy import Column, String, DateTime, Text, ForeignKey, func
from sqlalchemy.orm import relationship
from connect import Base

class User(Base):
    __tablename__ = "Users"

    UserID = Column(String(50), primary_key=True)
    Email = Column(String(255), unique=True, nullable=False)
    Username = Column(String(30), unique=True, nullable=False)
    Password = Column(String(255), nullable=False)  # increased length for hashed passwords
    Created_at = Column(DateTime, default=func.now())
    Last_active = Column(DateTime, default=func.now(), onupdate=func.now())

    # relationships
    conversations = relationship("Participant", back_populates="user")
    messages = relationship("Message", back_populates="user")

class Conversation(Base):
    __tablename__ = "Conversations"

    ConversationID = Column(String(50), primary_key=True)
    Created_at = Column(DateTime, default=func.now())
    Last_update = Column(DateTime, default=func.now(), onupdate=func.now())

    # relationships
    participants = relationship("Participant", back_populates="conversation")
    messages = relationship("Message", back_populates="conversation")


class Participant(Base):
    __tablename__ = "Participants"

    UserID = Column(String(50), ForeignKey("Users.UserID", ondelete="CASCADE"), primary_key=True)
    ConversationID = Column(String(50), ForeignKey("Conversations.ConversationID", ondelete="CASCADE"), primary_key=True)
    Joined_at = Column(DateTime, default=func.now())

    # relationships
    user = relationship("User", back_populates="conversations")
    conversation = relationship("Conversation", back_populates="participants")


class Message(Base):
    __tablename__ = "Messages"

    MessageID = Column(String(50), primary_key=True)
    ConversationID = Column(String(50), ForeignKey("Conversations.ConversationID", ondelete="CASCADE"), nullable=False)
    UserID = Column(String(50), ForeignKey("Users.UserID", ondelete="CASCADE"), nullable=False)
    Delivered_at = Column(DateTime, default=func.now())
    Content = Column(Text, default=None)

    # relationships
    conversation = relationship("Conversation", back_populates="messages")
    user = relationship("User", back_populates="messages")