import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  Avatar, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Divider,
  Paper
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import styled from 'styled-components';
import SideBar from '../../sideBar';

// Sample user data
const users = {
  therapist: {
    id: 'therapist',
    name: 'Dr. Sarah Johnson',
    avatar: 'https://i.pravatar.cc/150?img=5',
    role: 'Therapist'
  },
  client: {
    id: 'client',
    name: 'Alex Smith',
    avatar: 'https://i.pravatar.cc/150?img=11',
    role: 'Client'
  }
};

// Sample initial messages
const initialMessages = [
  {
    id: 1,
    sender: 'therapist',
    text: 'Hello Alex, how have you been feeling since our last session?',
    timestamp: '2023-05-15T10:30:00'
  },
  {
    id: 2,
    sender: 'client',
    text: 'Hi Dr. Johnson, I\'ve been doing better. The exercises you suggested have been helpful.',
    timestamp: '2023-05-15T10:32:00'
  },
  {
    id: 3,
    sender: 'therapist',
    text: 'That\'s great to hear! Would you like to share more about your progress?',
    timestamp: '2023-05-15T10:33:00'
  }
];

const Messages = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState('client'); // Default to client view
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg = {
      id: messages.length + 1,
      sender: currentUser,
      text: newMessage,
      timestamp: new Date().toISOString()
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleUser = () => {
    setCurrentUser(currentUser === 'client' ? 'therapist' : 'client');
  };

  return (
    <SideBar>
      <PageContainer>
        <Header>
          <UserInfo onClick={toggleUser}>
            <Avatar src={users[currentUser].avatar} />
            <div>
              <Typography variant="subtitle1">{users[currentUser].name}</Typography>
              <Typography variant="caption">{users[currentUser].role}</Typography>
            </div>
          </UserInfo>
        </Header>
        
        <MessagesContainer component={Paper} elevation={3}>
          <List sx={{ width: '100%', bgcolor: 'background.paper', overflow: 'auto', flexGrow: 1 }}>
            {messages.map((message) => (
              <React.Fragment key={message.id}>
                <ListItem alignItems="flex-start" sx={{
                  justifyContent: message.sender === currentUser ? 'flex-end' : 'flex-start'
                }}>
                  {message.sender !== currentUser && (
                    <ListItemAvatar>
                      <Avatar alt={users[message.sender].name} src={users[message.sender].avatar} />
                    </ListItemAvatar>
                  )}
                  <MessageBubble isCurrentUser={message.sender === currentUser}>
                    <ListItemText
                      primary={message.sender !== currentUser && users[message.sender].name}
                      secondary={
                        <>
                          <MessageText>{message.text}</MessageText>
                          <TimeStamp>{formatTime(message.timestamp)}</TimeStamp>
                        </>
                      }
                      sx={{
                        color: message.sender === currentUser ? '#fff' : 'inherit'
                      }}
                    />
                  </MessageBubble>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
            <div ref={messagesEndRef} />
          </List>
        </MessagesContainer>

        <InputContainer>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            multiline
            maxRows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '25px',
                paddingRight: '50px'
              }
            }}
          />
          <SendButton onClick={handleSendMessage}>
            <SendIcon />
          </SendButton>
        </InputContainer>
      </PageContainer>
    </SideBar>
  );
};

// Styled components
const PageContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px); // Adjust based on your header height
  padding: 16px;
  background-color: #f5f5f5;
`;

const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  margin-bottom: 16px;
`;

const UserInfo = styled(Box)`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
`;

const MessagesContainer = styled(Box)`
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
`;

const MessageBubble = styled(Box)`
  max-width: 70%;
  padding: 8px 16px;
  border-radius: 18px;
  background-color: ${props => props.isCurrentUser ? '#1976d2' : '#e0e0e0'};
  color: ${props => props.isCurrentUser ? '#fff' : '#000'};
  word-wrap: break-word;
`;

const MessageText = styled.span`
  white-space: pre-wrap;
`;

const TimeStamp = styled.span`
  display: block;
  font-size: 0.7rem;
  text-align: right;
  margin-top: 4px;
  opacity: 0.8;
`;

const InputContainer = styled(Box)`
  position: relative;
  width: 100%;
`;

const SendButton = styled(IconButton)`
  position: absolute !important;
  right: 8px;
  bottom: 8px;
  background-color: #1976d2 !important;
  color: white !important;
  &:hover {
    background-color: #1565c0 !important;
  }
`;

export default Messages;