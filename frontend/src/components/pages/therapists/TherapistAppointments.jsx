import React, { useState, useEffect } from 'react';
import { format, addDays, isBefore, isAfter, parseISO } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import SideBar from '../../TherapistSideBar';
import '../../../TherapistAppointments.css';

// Define the backend URL
const BACKEND_URL = 'http://localhost:3500';

const TherapistAppointments = () => {
  // State for appointments, selected date, and form inputs
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    contact: '',
    email: '',
    appointmentTime: '',
    notes: '',
    status: 'scheduled'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState(new Date());
  const [rescheduleTime, setRescheduleTime] = useState('');

  // State for therapist ID
  const [therapistId, setTherapistId] = useState(null);
  const [error, setError] = useState(null);

  // Get therapist ID from user
  useEffect(() => {
    const fetchTherapistId = async () => {
      try {
        console.log("Fetching therapist profile...");
        const response = await fetch(`${BACKEND_URL}/api/therapist/profile`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch therapist profile');
        }

        const data = await response.json();
        console.log("Therapist profile data:", data);

        // If the profile already has therapist_id, use it directly
        if (data.therapist_id) {
          setTherapistId(data.therapist_id);
          return;
        }

        // Otherwise, find the therapist_id from the therapists table using user_id
        console.log("Fetching therapist ID using user_id:", data.user_id);
        const therapistResponse = await fetch(`${BACKEND_URL}/api/therapists?userId=${data.user_id}`, {
          credentials: 'include'
        });

        if (!therapistResponse.ok) {
          throw new Error('Failed to fetch therapist ID');
        }

        const therapistData = await therapistResponse.json();
        console.log("Therapist data:", therapistData);
        setTherapistId(therapistData.therapist_id);
      } catch (err) {
        console.error('Error fetching therapist ID:', err);
        setError('Could not load therapist information');
      }
    };

    fetchTherapistId();
  }, []);

  // Fetch appointments from API
  useEffect(() => {
    if (!therapistId) return;

    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching appointments for therapist ID:", therapistId);
        const response = await fetch(`${BACKEND_URL}/api/therapist/appointments`, {
          credentials: 'include'
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Appointments data:", data);

        // If no appointments, set empty array
        if (!data || data.length === 0) {
          setAppointments([]);
          setError(null);
          setIsLoading(false);
          return;
        }

        // Transform the data to match our component's expected format
        const formattedAppointments = data.map(appointment => ({
          id: appointment.appointment_id,
          patientName: `${appointment.first_name} ${appointment.last_name}`,
          contact: appointment.phone || 'No phone provided',
          email: appointment.email,
          date: format(new Date(appointment.scheduled_time), 'yyyy-MM-dd'),
          time: format(new Date(appointment.scheduled_time), 'HH:mm'),
          notes: appointment.notes || '',
          status: appointment.status,
          duration: appointment.duration_minutes
        }));

        setAppointments(formattedAppointments);
        setError(null);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [therapistId]);

  // Filter appointments based on selected date and tab
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = parseISO(appointment.date);
    const today = new Date();
    const threeDaysFromNow = addDays(today, 3);

    // For the calendar view, filter by the selected date
    const matchesSelectedDate = format(appointmentDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

    // For the upcoming tab, show appointments in the next 3 days
    const isWithinNextThreeDays = isAfter(appointmentDate, today) && isBefore(appointmentDate, threeDaysFromNow);

    if (activeTab === 'upcoming') {
      // In upcoming tab, show all appointments in the next 3 days regardless of selected date
      return isWithinNextThreeDays && appointment.status !== 'cancelled' && appointment.status !== 'declined';
    } else if (activeTab === 'past') {
      return matchesSelectedDate && isBefore(appointmentDate, today) && appointment.status !== 'cancelled' && appointment.status !== 'declined';
    } else if (activeTab === 'cancelled') {
      return matchesSelectedDate && (appointment.status === 'cancelled' || appointment.status === 'declined');
    }
    return matchesSelectedDate;
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newAppt = {
      id: appointments.length + 1,
      ...newAppointment,
      date: format(selectedDate, 'yyyy-MM-dd')
    };

    setAppointments(prev => [...prev, newAppt]);
    setNewAppointment({
      patientName: '',
      contact: '',
      email: '',
      appointmentTime: '',
      notes: '',
      status: 'scheduled'
    });
    setShowForm(false);
  };

  // Handle appointment status change
  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/appointments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          status: newStatus,
          cancellationReason: newStatus === 'cancelled' ? 'Cancelled by therapist' : null
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }

      // Update local state
      setAppointments(prev =>
        prev.map(appt =>
          appt.id === id ? { ...appt, status: newStatus } : appt
        )
      );

      // Show confirmation message
      alert(`Appointment ${newStatus === 'scheduled' ? 'accepted' : newStatus} successfully.`);

      setError(null);
    } catch (err) {
      console.error('Error updating appointment status:', err);
      setError('Failed to update appointment status. Please try again.');
    }
  };

  // Handle reschedule button click
  const handleReschedule = (appointment) => {
    setAppointmentToReschedule(appointment);
    setRescheduleDate(parseISO(appointment.date));
    setRescheduleTime(appointment.time);
    setShowRescheduleModal(true);
  };

  // Handle reschedule form submission
  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();

    if (!appointmentToReschedule || !rescheduleTime) {
      alert('Please select a time for rescheduling.');
      return;
    }

    try {
      // Format the new date and time
      const formattedDate = format(rescheduleDate, 'yyyy-MM-dd');
      const newScheduledTime = `${formattedDate}T${rescheduleTime}:00`;

      // Call API to update the appointment
      const response = await fetch(`${BACKEND_URL}/api/appointments/${appointmentToReschedule.id}/reschedule`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          scheduledTime: newScheduledTime,
          status: 'rescheduled'
        })
      });

      if (!response.ok) {
        // If the API fails, update locally anyway for demo purposes
        console.warn('API call failed, updating locally');

        // Update local state
        setAppointments(prev =>
          prev.map(appt =>
            appt.id === appointmentToReschedule.id
              ? {
                  ...appt,
                  date: formattedDate,
                  time: rescheduleTime,
                  status: 'rescheduled'
                }
              : appt
          )
        );
      } else {
        // If API succeeds, update from response
        const updatedAppointment = await response.json();

        // Update local state with API response
        setAppointments(prev =>
          prev.map(appt =>
            appt.id === appointmentToReschedule.id
              ? {
                  ...appt,
                  date: format(new Date(updatedAppointment.scheduled_time), 'yyyy-MM-dd'),
                  time: format(new Date(updatedAppointment.scheduled_time), 'HH:mm'),
                  status: updatedAppointment.status
                }
              : appt
          )
        );
      }

      // Close modal and reset state
      setShowRescheduleModal(false);
      setAppointmentToReschedule(null);

      // Show confirmation
      alert('Appointment rescheduled successfully.');

    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      setError('Failed to reschedule appointment. Please try again.');
    }
  };

  // Time slots for the appointment form
  const timeSlots = [
    '08:30 am', '09:00 am', '09:30 am',
    '10:00 am', '10:30 am', '11:00 am',
    '11:30 am', '12:00 pm', '12:30 pm',
    '02:00 pm', '02:30 pm', '03:00 pm',
    '03:30 pm', '04:00 pm', '04:30 pm',
  ];

  return (
    <SideBar>
      <div className="therapist-appointment-page">
        <h1>Appointment Management</h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="appointment-container">
          <div className="calendar-section">
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              minDate={new Date()}
              className="therapist-calendar"
            />

            <button
              className="add-appointment-btn"
              onClick={() => setShowForm(true)}
              disabled={!therapistId}
            >
              + Add Appointment
            </button>
          </div>

          <div className="appointments-section">
            <h2>Appointments for {format(selectedDate, 'MMMM d, yyyy')}</h2>

            <div className="tabs">
              <button
                className={activeTab === 'upcoming' ? 'active' : ''}
                onClick={() => setActiveTab('upcoming')}
              >
                Upcoming
              </button>
              <button
                className={activeTab === 'past' ? 'active' : ''}
                onClick={() => setActiveTab('past')}
              >
                Past
              </button>
              <button
                className={activeTab === 'cancelled' ? 'active' : ''}
                onClick={() => setActiveTab('cancelled')}
              >
                Cancelled
              </button>
            </div>

            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading appointments...</p>
              </div>
            ) : !therapistId ? (
              <p>Unable to load therapist information. Please refresh the page.</p>
            ) : filteredAppointments.length === 0 ? (
              <p>No appointments found for this date.</p>
            ) : (
              <div className="appointments-list">
                {filteredAppointments.map(appointment => (
                  <div key={appointment.id} className={`appointment-card ${appointment.status}`}>
                    <div className="appointment-header">
                      <h3>{appointment.patientName}</h3>
                      <span className="appointment-time">{appointment.time}</span>
                      <span className={`status-badge ${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </div>

                    <div className="appointment-details">
                      <p><strong>Contact:</strong> {appointment.contact}</p>
                      <p><strong>Email:</strong> {appointment.email}</p>
                      <p><strong>Duration:</strong> {appointment.duration || 60} minutes</p>
                      <p><strong>Notes:</strong> {appointment.notes}</p>
                    </div>

                    <div className="appointment-actions">
                      {appointment.status === 'pending' && (
                        <>
                          <button
                            className="accept-btn"
                            onClick={() => handleStatusChange(appointment.id, 'scheduled')}
                          >
                            Accept
                          </button>
                          <button
                            className="decline-btn"
                            onClick={() => handleStatusChange(appointment.id, 'declined')}
                          >
                            Decline
                          </button>
                          <button
                            className="reschedule-btn"
                            onClick={() => handleReschedule(appointment)}
                          >
                            Reschedule
                          </button>
                        </>
                      )}

                      {appointment.status === 'scheduled' && (
                        <>
                          <button
                            className="complete-btn"
                            onClick={() => handleStatusChange(appointment.id, 'completed')}
                          >
                            Mark as Completed
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {(appointment.status === 'cancelled' || appointment.status === 'declined') && (
                        <p className="status-message">This appointment has been {appointment.status}.</p>
                      )}

                      {appointment.status === 'completed' && (
                        <p className="status-message">This appointment has been completed.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* New Appointment Modal/Form */}
        {showForm && (
          <div className="appointment-form-modal">
            <div className="appointment-form-container">
              <h2>Schedule New Appointment</h2>
              <button
                className="close-btn"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Patient Name:</label>
                  <input
                    type="text"
                    name="patientName"
                    value={newAppointment.patientName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Contact Number:</label>
                  <input
                    type="tel"
                    name="contact"
                    value={newAppointment.contact}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={newAppointment.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Appointment Time:</label>
                  <select
                    name="appointmentTime"
                    value={newAppointment.appointmentTime}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Notes:</label>
                  <textarea
                    name="notes"
                    value={newAppointment.notes}
                    onChange={handleInputChange}
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Schedule Appointment
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Reschedule Appointment Modal */}
        {showRescheduleModal && appointmentToReschedule && (
          <div className="appointment-form-modal">
            <div className="appointment-form-container">
              <h2>Reschedule Appointment</h2>
              <button
                className="close-btn"
                onClick={() => {
                  setShowRescheduleModal(false);
                  setAppointmentToReschedule(null);
                }}
              >
                ×
              </button>

              <form onSubmit={handleRescheduleSubmit}>
                <div className="form-group">
                  <label>Patient:</label>
                  <p>{appointmentToReschedule.patientName}</p>
                </div>

                <div className="form-group">
                  <label>Current Date:</label>
                  <p>{format(parseISO(appointmentToReschedule.date), 'MMMM d, yyyy')}</p>
                </div>

                <div className="form-group">
                  <label>Current Time:</label>
                  <p>{appointmentToReschedule.time}</p>
                </div>

                <div className="form-group">
                  <label>New Date:</label>
                  <Calendar
                    onChange={setRescheduleDate}
                    value={rescheduleDate}
                    minDate={new Date()}
                    className="reschedule-calendar"
                  />
                </div>

                <div className="form-group">
                  <label>New Time:</label>
                  <select
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    required
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="submit-btn">
                  Confirm Reschedule
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </SideBar>
  );
};

export default TherapistAppointments;