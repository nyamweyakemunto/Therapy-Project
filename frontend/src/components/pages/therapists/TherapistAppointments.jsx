import React, { useState, useEffect } from 'react';
import { format, addDays, isBefore, isAfter, parseISO } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import SideBar from '../../TherapistSideBar';
import '../../../TherapistAppointments.css';

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

  // Fetch appointments from API (mock data for this example)
  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        // Mock data - replace with actual API call
        const mockAppointments = [
          {
            id: 1,
            patientName: 'John Doe',
            contact: '555-123-4567',
            email: 'john@example.com',
            date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
            time: '10:00',
            notes: 'Follow-up session',
            status: 'scheduled'
          },
          {
            id: 2,
            patientName: 'Jane Smith',
            contact: '555-987-6543',
            email: 'jane@example.com',
            date: format(addDays(new Date(), 2), 'yyyy-MM-dd'),
            time: '14:30',
            notes: 'Initial consultation',
            status: 'scheduled'
          }
        ];
        setAppointments(mockAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Filter appointments based on selected date and tab
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = parseISO(appointment.date);
    const matchesDate = format(appointmentDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    
    if (activeTab === 'upcoming') {
      return matchesDate && isAfter(appointmentDate, new Date()) && appointment.status !== 'cancelled';
    } else if (activeTab === 'past') {
      return matchesDate && isBefore(appointmentDate, new Date()) && appointment.status !== 'cancelled';
    } else if (activeTab === 'cancelled') {
      return matchesDate && appointment.status === 'cancelled';
    }
    return matchesDate;
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
  const handleStatusChange = (id, newStatus) => {
    setAppointments(prev =>
      prev.map(appt =>
        appt.id === id ? { ...appt, status: newStatus } : appt
      )
    );
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
              <p>Loading appointments...</p>
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
                      <p><strong>Notes:</strong> {appointment.notes}</p>
                    </div>
                    
                    {appointment.status === 'scheduled' && (
                      <div className="appointment-actions">
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
                      </div>
                    )}
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
      </div>
    </SideBar>
  );
};

export default TherapistAppointments;