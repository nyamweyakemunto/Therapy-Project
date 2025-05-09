import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SideBar from '../../PatientSideBar';
import { format } from 'date-fns';

// Define the backend URL
const BACKEND_URL = 'http://localhost:3500';

const ConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [confirmedAppointments, setConfirmedAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get booking details from location state (if coming from a booking form)
  const bookingDetails = location.state?.bookingDetails || null;

  // Fetch confirmed appointments
  useEffect(() => {
    const fetchConfirmedAppointments = async () => {
      try {
        setIsLoading(true);
        // Try to fetch patient appointments
        const response = await fetch(`${BACKEND_URL}/api/patient/appointments`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch appointments: ${response.status}`);
        }

        const data = await response.json();
        console.log('Confirmed appointments:', data);

        // Filter for scheduled/confirmed appointments only
        const confirmed = data.filter(appointment =>
          appointment.status === 'scheduled' || appointment.status === 'confirmed'
        );

        setConfirmedAppointments(confirmed);
        setError(null);
      } catch (err) {
        console.error('Error fetching confirmed appointments:', err);
        setError('Failed to load your confirmed appointments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfirmedAppointments();
  }, []);

  // Format date for display
  const formatAppointmentDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (err) {
      return dateString;
    }
  };

  // Format time for display
  const formatAppointmentTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return format(date, 'h:mm a');
    } catch (err) {
      return timeString;
    }
  };

  // Handle view all appointments
  const handleViewAllAppointments = () => {
    navigate('/appointments');
  };

  return (
    <SideBar>
      <ConfirmationContainer>
        {isLoading ? (
          <LoadingSpinner>
            <Spinner />
            <p>Loading your confirmed appointments...</p>
          </LoadingSpinner>
        ) : error ? (
          <ErrorMessage>
            <h2>Error</h2>
            <p>{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </ErrorMessage>
        ) : bookingDetails ? (
          // Show single booking confirmation if coming from booking form
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
                  <strong>{bookingDetails.duration || '60 minutes'}</strong>
                </DetailItem>
                <DetailItem>
                  <span>Location:</span>
                  <strong>{bookingDetails.location || 'Online (Video)'}</strong>
                </DetailItem>
              </DetailSection>

              <DetailSection>
                <h2>Booking Information</h2>
                <DetailItem>
                  <span>Confirmation #:</span>
                  <strong>{bookingDetails.confirmationNumber || `TH-${Date.now().toString().slice(-6)}`}</strong>
                </DetailItem>
                <DetailItem>
                  <span>Status:</span>
                  <strong>Confirmed</strong>
                </DetailItem>
              </DetailSection>
            </ConfirmationDetails>

            <NextSteps>
              <h2>What's Next?</h2>
              <ul>
                <li>You'll receive a confirmation email with all these details</li>
                <li>For online sessions, the video link will be sent 24 hours before your appointment</li>
                <li>Please complete any intake forms if you haven't already</li>
                <li>Cancel or reschedule at least 24 hours in advance if needed</li>
              </ul>
            </NextSteps>

            <ContactInfo>
              <p>Questions? Contact us at <strong>support@therapyconnect.com</strong> or <strong>(555) 123-4567</strong></p>
            </ContactInfo>

            <Actions>
              <Button primary>Add to Calendar</Button>
              <Button onClick={handleViewAllAppointments}>View All Appointments</Button>
            </Actions>
          </ConfirmationCard>
        ) : confirmedAppointments.length > 0 ? (
          // Show list of confirmed appointments
          <ConfirmationCard>
            <Header>
              <h1>Your Confirmed Appointments</h1>
            </Header>

            <AppointmentsList>
              {confirmedAppointments.map((appointment, index) => (
                <AppointmentItem key={appointment.appointment_id || index}>
                  <AppointmentHeader>
                    <h3>{appointment.first_name} {appointment.last_name}</h3>
                    <StatusBadge status={appointment.status}>{appointment.status}</StatusBadge>
                  </AppointmentHeader>

                  <AppointmentDetails>
                    <DetailItem>
                      <span>Date:</span>
                      <strong>{formatAppointmentDate(appointment.scheduled_time)}</strong>
                    </DetailItem>
                    <DetailItem>
                      <span>Time:</span>
                      <strong>{formatAppointmentTime(appointment.scheduled_time)}</strong>
                    </DetailItem>
                    <DetailItem>
                      <span>Duration:</span>
                      <strong>{appointment.duration_minutes || 60} minutes</strong>
                    </DetailItem>
                    <DetailItem>
                      <span>Type:</span>
                      <strong>{appointment.appointment_type || 'Therapy Session'}</strong>
                    </DetailItem>
                    {appointment.notes && (
                      <DetailItem>
                        <span>Notes:</span>
                        <strong>{appointment.notes}</strong>
                      </DetailItem>
                    )}
                  </AppointmentDetails>
                </AppointmentItem>
              ))}
            </AppointmentsList>

            <Actions>
              <Button primary onClick={handleViewAllAppointments}>View All Appointments</Button>
            </Actions>
          </ConfirmationCard>
        ) : (
          // No confirmed appointments
          <ConfirmationCard>
            <Header>
              <h1>No Confirmed Appointments</h1>
            </Header>

            <EmptyState>
              <p>You don't have any confirmed appointments at the moment.</p>
              <p>Book a session with one of our therapists to get started.</p>
            </EmptyState>

            <Actions>
              <Button primary onClick={() => navigate('/therapist-search')}>Find a Therapist</Button>
              <Button onClick={handleViewAllAppointments}>View All Appointments</Button>
            </Actions>
          </ConfirmationCard>
        )}
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

// Additional styled components
const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #2e7d32;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
  width: 100%;
  max-width: 800px;

  h2 {
    color: #e53935;
    margin-bottom: 15px;
  }

  p {
    margin-bottom: 20px;
    color: #555;
  }
`;

const AppointmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
`;

const AppointmentItem = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #2e7d32;
`;

const AppointmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  h3 {
    margin: 0;
    color: #333;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;

  ${props => {
    switch(props.status) {
      case 'scheduled':
      case 'confirmed':
        return `
          background-color: #e8f5e9;
          color: #2e7d32;
        `;
      case 'pending':
        return `
          background-color: #fff3e0;
          color: #e65100;
        `;
      case 'cancelled':
      case 'declined':
        return `
          background-color: #ffebee;
          color: #c62828;
        `;
      case 'completed':
        return `
          background-color: #e3f2fd;
          color: #1565c0;
        `;
      default:
        return `
          background-color: #f5f5f5;
          color: #616161;
        `;
    }
  }}
`;

const AppointmentDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 30px 0;
  color: #666;

  p {
    margin-bottom: 10px;
  }
`;

export default ConfirmationPage;