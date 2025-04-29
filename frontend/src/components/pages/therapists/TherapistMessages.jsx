import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SideBar from '../../TherapistSideBar';
import '../../../TherapistMessages.css';

const TherapyMessages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { conversationId } = useParams();

  // Sample data for demonstration
  const sampleConversations = [
    {
      id: 'conv1',
      clientName: 'Sarah Johnson',
      lastMessage: 'I wanted to follow up on our last session',
      updatedAt: '2023-05-15T14:30:00Z',
      lastActive: '2023-05-15T14:28:00Z',
      unreadCount: 2,
      messages: [
        {
          id: 'msg1',
          content: 'Hello Dr., I wanted to follow up on our last session',
          senderType: 'client',
          timestamp: '2023-05-15T14:20:00Z'
        },
        {
          id: 'msg2',
          content: 'I found the breathing exercises really helpful',
          senderType: 'client',
          timestamp: '2023-05-15T14:25:00Z'
        },
        {
          id: 'msg3',
          content: 'Hi Sarah, I\'m glad to hear that. How often have you been practicing them?',
          senderType: 'therapist',
          timestamp: '2023-05-15T14:28:00Z'
        }
      ]
    },
    {
      id: 'conv2',
      clientName: 'Michael Chen',
      lastMessage: 'I think I need to adjust our next appointment',
      updatedAt: '2023-05-14T10:15:00Z',
      lastActive: '2023-05-14T10:10:00Z',
      unreadCount: 0,
      messages: [
        {
          id: 'msg4',
          content: 'Good morning, I think I need to adjust our next appointment',
          senderType: 'client',
          timestamp: '2023-05-14T10:05:00Z'
        },
        {
          id: 'msg5',
          content: 'I have a work conflict on Thursday at 2pm',
          senderType: 'client',
          timestamp: '2023-05-14T10:08:00Z'
        },
        {
          id: 'msg6',
          content: 'No problem Michael. How about Friday at 11am instead?',
          senderType: 'therapist',
          timestamp: '2023-05-14T10:10:00Z'
        }
      ]
    },
    {
      id: 'conv3',
      clientName: 'Emma Rodriguez',
      lastMessage: 'I\'ve been feeling much better this week',
      updatedAt: '2023-05-13T16:45:00Z',
      lastActive: '2023-05-13T16:40:00Z',
      unreadCount: 1,
      messages: [
        {
          id: 'msg7',
          content: 'Just wanted to let you know I\'ve been feeling much better this week',
          senderType: 'client',
          timestamp: '2023-05-13T16:35:00Z'
        },
        {
          id: 'msg8',
          content: 'The techniques we discussed have really helped with my anxiety',
          senderType: 'client',
          timestamp: '2023-05-13T16:38:00Z'
        },
        {
          id: 'msg9',
          content: 'That\'s wonderful progress, Emma! Let\'s discuss this more in our next session.',
          senderType: 'therapist',
          timestamp: '2023-05-13T16:40:00Z'
        }
      ]
    }
  ];

  // Load sample data instead of API call
  useEffect(() => {
    const loadSampleData = () => {
      setIsLoading(true);
      try {
        setConversations(sampleConversations);
        
        // If URL has conversationId, select that conversation
        if (conversationId) {
          const conv = sampleConversations.find(c => c.id === conversationId);
          setSelectedConversation(conv);
        } else if (sampleConversations.length > 0) {
          // Select first conversation by default
          setSelectedConversation(sampleConversations[0]);
        }
      } catch (error) {
        console.error('Error loading sample data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSampleData();
  }, [conversationId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    // Create a new message object
    const sentMessage = {
      id: `msg${Date.now()}`,
      content: newMessage,
      senderType: 'therapist',
      timestamp: new Date().toISOString()
    };
    
    // Update the selected conversation with the new message
    setSelectedConversation(prev => ({
      ...prev,
      messages: [...prev.messages, sentMessage],
      lastMessage: newMessage,
      updatedAt: new Date().toISOString()
    }));
    
    // Update the conversation in the list
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { 
              ...conv, 
              lastMessage: newMessage, 
              updatedAt: new Date().toISOString(),
              messages: [...conv.messages, sentMessage]
            }
          : conv
      )
    );
    
    setNewMessage('');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SideBar>
      <div className="therapy-messages-container">
        <div className="conversation-list">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="conversation-items">
            {isLoading ? (
              <div className="loading">Loading conversations...</div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map(conversation => (
                <div 
                  key={conversation.id}
                  className={`conversation-item ${selectedConversation?.id === conversation.id ? 'selected' : ''}`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="client-avatar">
                    {conversation.clientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="conversation-details">
                    <div className="client-name">{conversation.clientName}</div>
                    <div className="last-message">{conversation.lastMessage}</div>
                  </div>
                  <div className="conversation-meta">
                    <div className="time">{formatTime(conversation.updatedAt)}</div>
                    {conversation.unreadCount > 0 && (
                      <div className="unread-count">{conversation.unreadCount}</div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-conversations">No conversations found</div>
            )}
          </div>
        </div>
        
        <div className="conversation-view">
          {selectedConversation ? (
            <>
              <div className="conversation-header">
                <div className="client-info">
                  <div className="client-avatar">
                    {selectedConversation.clientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="client-details">
                    <h3>{selectedConversation.clientName}</h3>
                    <p>Last active: {formatTime(selectedConversation.lastActive)}</p>
                  </div>
                </div>
                <div className="conversation-actions">
                  <button className="action-btn">
                    <i className="fas fa-phone"></i>
                  </button>
                  <button className="action-btn">
                    <i className="fas fa-video"></i>
                  </button>
                  <button className="action-btn">
                    <i className="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
              
              <div className="message-list">
                {selectedConversation.messages.map((message, index) => (
                  <div key={index} className={`message ${message.senderType === 'therapist' ? 'sent' : 'received'}`}>
                    <div className="message-content">
                      <p>{message.content}</p>
                      <div className="message-time">{formatTime(message.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="message-input">
                <textarea
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </>
          ) : (
            <div className="select-conversation">
              <p>Select a conversation to view messages</p>
            </div>
          )}
        </div>
      </div>
    </SideBar>
  );
};

// Helper function
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default TherapyMessages;