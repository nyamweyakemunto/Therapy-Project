import React from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import SideBar from '../../sideBar';

const ConfirmationPage = () => {
  // Get booking details from location state (if coming from a booking form)
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails || {
    therapistName: 'Dr. Sarah Johnson',
    sessionType: 'Cognitive Behavioral Therapy',
    date: 'June 15, 2023',
    time: '2:00 PM - 3:00 PM',
    duration: '60 minutes',
    location: 'Online (Zoom)',
    price: '$120',
    confirmationNumber: 'TH-2023-0642'
  };

  return (
    <SideBar>
      <ConfirmationContainer>
        <ConfirmationCard>
          <Header>
            <h1>Your Therapy Session is Confirmed!</h1>
            <Checkmark>✓</Checkmark>
          </Header>
          
          <ConfirmationDetails>
            <DetailSection>
              <h2>Session Details</h2>
              <DetailItem>
                <span>Therapist:</span>
                <strong>{bookingDetails.therapistName}</strong>
              </DetailItem>
              <DetailItem>
                <span>Session Type:</span>
                <strong>{bookingDetails.sessionType}</strong>
              </DetailItem>
              <DetailItem>
                <span>Date:</span>
                <strong>{bookingDetails.date}</strong>
              </DetailItem>
              <DetailItem>
                <span>Time:</span>
                <strong>{bookingDetails.time}</strong>
              </DetailItem>
              <DetailItem>
                <span>Duration:</span>
                <strong>{bookingDetails.duration}</strong>
              </DetailItem>
              <DetailItem>
                <span>Location:</span>
                <strong>{bookingDetails.location}</strong>
              </DetailItem>
            </DetailSection>

            <DetailSection>
              <h2>Booking Information</h2>
              <DetailItem>
                <span>Confirmation #:</span>
                <strong>{bookingDetails.confirmationNumber}</strong>
              </DetailItem>
              <DetailItem>
                <span>Total:</span>
                <strong>{bookingDetails.price}</strong>
              </DetailItem>
            </DetailSection>
          </ConfirmationDetails>

          <NextSteps>
            <h2>What's Next?</h2>
            <ul>
              <li>You'll receive a confirmation email with all these details</li>
              <li>For online sessions, the Zoom link will be sent 24 hours before your appointment</li>
              <li>Please complete any intake forms if you haven't already</li>
              <li>Cancel or reschedule at least 24 hours in advance if needed</li>
            </ul>
          </NextSteps>

          <ContactInfo>
            <p>Questions? Contact us at <strong>support@therapyconnect.com</strong> or <strong>(555) 123-4567</strong></p>
          </ContactInfo>

          <Actions>
            <Button primary>Add to Calendar</Button>
            <Button>View Upcoming Appointments</Button>
          </Actions>
        </ConfirmationCard>
      </ConfirmationContainer>
    </SideBar>
  );
};

// Styled components
const ConfirmationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px); // Adjust based on your header height
  background-color: #f5f7fa;
  padding: 20px;
  width: 100% ; // Adjust based on your sidebar width

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    min-height: 100vh;
  }
`;

const ConfirmationCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    color: #2e7d32;
    font-size: 28px;
    margin-bottom: 15px;
  }
`;

const Checkmark = styled.div`
  background-color: #2e7d32;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  margin: 0 auto;
`;

const ConfirmationDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailSection = styled.div`
  h2 {
    color: #333;
    font-size: 18px;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
  }
`;

const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  
  span {
    color: #666;
  }
  
  strong {
    color: #333;
    text-align: right;
  }
`;

const NextSteps = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 25px;
  
  h2 {
    color: #333;
    font-size: 18px;
    margin-bottom: 15px;
  }
  
  ul {
    padding-left: 20px;
    color: #555;
    line-height: 1.6;
  }
  
  li {
    margin-bottom: 8px;
  }
`;

const ContactInfo = styled.div`
  text-align: center;
  color: #666;
  margin-bottom: 25px;
  font-size: 15px;
`;

const Actions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.primary ? `
    background-color: #2e7d32;
    color: white;
    border: none;
    
    &:hover {
      background-color: #1b5e20;
    }
  ` : `
    background-color: white;
    color: #2e7d32;
    border: 1px solid #2e7d32;
    
    &:hover {
      background-color: #f1f8e9;
    }
  `}
`;

export default ConfirmationPage;