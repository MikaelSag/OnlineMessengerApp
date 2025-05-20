INSERT INTO Users (UserID, Email, Username, Password) VALUES
('1', 'alice@example.com', '1', '1'),
('2', 'bob@example.com', '2', '2'),
INSERT INTO Conversations (ConversationID) VALUES
('conversation1'),

INSERT INTO Participants (UserID, ConversationID) VALUES
('1', 'conversation1'),
('2', 'conversation1'),
INSERT INTO Messages (MessageID, ConversationID, UserID, Content) VALUES
('message1', 'conversation1', '1', 'Hello Bob!'),
('message2', 'conversation1', '2', 'Hey Alice!'),