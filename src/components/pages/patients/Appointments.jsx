import React, { useState, useEffect } from 'react';
import { FaHeartbeat, FaCalendarPlus, FaList, FaSave, FaTrash, FaCalendarDay, FaClock, FaCalendarCheck } from 'react-icons/fa';
import SideBar from '../../PatientSideBar';

import '../../../App.css';
const Appointments = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    clientName: '',
    appointmentDate: '',
    appointmentTime: '',
    therapyType: '',
    notes: ''
  });

  // State for appointments
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Load appointments from localStorage on component mount
  useEffect(() => {
    const savedAppointments = JSON.parse(localStorage.getItem('therapyAppointments')) || [];
    setAppointments(savedAppointments);
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('therapyAppointments', JSON.stringify(appointments));
  }, [appointments]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newAppointment = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [...prev, newAppointment]);
    setFormData({
      clientName: '',
      appointmentDate: '',
      appointmentTime: '',
      therapyType: '',
      notes: ''
    });

    alert('Appointment booked successfully!');
  };

  // Delete an appointment
  const deleteAppointment = (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
    }
  };

  // Filter appointments based on search and filter type
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         appointment.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || appointment.therapyType === filterType;
    return matchesSearch && matchesType;
  });

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <SideBar>
      <div className="container">
        <header className="app-header">
          <h1><FaHeartbeat /> Therapy Connect</h1>
          <p>Manage your therapy appointments with ease</p>
        </header>

        <div className="app-content">
          {/* Appointment Booking Section */}
          <section className="booking-section">
            <h2><FaCalendarPlus /> Book New Appointment</h2>
            <form onSubmit={handleSubmit} className="appointment-form">
              <div className="form-group">
                <label htmlFor="clientName">Full Name</label>
                <input
                  type="text"
                  id="clientName"
                  placeholder="Enter your full name"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="appointmentDate">Date</label>
                <input
                  type="date"
                  id="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="appointmentTime">Time</label>
                <input
                  type="time"
                  id="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="therapyType">Therapy Type</label>
                <select
                  id="therapyType"
                  value={formData.therapyType}
                  onChange={handleInputChange}
                  required
                >
                <option value="Select">Select</option>
                <option value="Pregnancy Therapy">Pregnancy Therapy</option>
                <option value="Postpartum Therapy">Postpartum Therapy</option>
                <option value="Trying to conceive Therapy">Trying to Conceive Therapy</option>
                <option value="Couples Therapy">Couples Therapy</option>
                <option value="Pregnancy Loss Therapy">Pregnancy Loss Therapy</option>
                <option value="Family Planning Therapy">Family Planning Therapy</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Notes (Optional)</label>
                <textarea
                  id="notes"
                  placeholder="Any specific concerns or notes..."
                  value={formData.notes}
                  onChange={handleInputChange}
                />
              </div>
              
              <button type="submit" className="btn btn-primary">
                <FaSave /> Book Appointment
              </button>
            </form>
          </section>

          {/* Appointments List Section */}
          <section className="appointments-section">
            <h2><FaList /> Your Appointments</h2>
            <div className="filter-controls">
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="Select">Select</option>
                <option value="Pregnancy Therapy">Pregnancy Therapy</option>
                <option value="Postpartum Therapy">Postpartum Therapy</option>
                <option value="Trying to conceive Therapy">Trying to Conceive Therapy</option>
                <option value="Couples Therapy">Couples Therapy</option>
                <option value="Pregnancy Loss Therapy">Pregnancy Loss Therapy</option>
                <option value="Family Planning Therapy">Family Planning Therapy</option>
              </select>
            </div>
            
            <div className="appointments-list">
              {filteredAppointments.length === 0 ? (
                <div className="empty-state">
                  <FaCalendarCheck />
                  <p>{appointments.length === 0 ? 'No appointments booked yet' : 'No appointments found'}</p>
                </div>
              ) : (
                filteredAppointments.map(appointment => (
                  <div key={appointment.id} className="appointment-card">
                    <h3>{appointment.clientName}</h3>
                    <div className="appointment-meta">
                      <span><FaCalendarDay /> {formatDate(appointment.appointmentDate)}</span>
                      <span><FaClock /> {formatTime(appointment.appointmentTime)}</span>
                    </div>
                    <div className="appointment-type">{appointment.therapyType}</div>
                    {appointment.notes && <p className="appointment-notes">{appointment.notes}</p>}
                    <div className="appointment-actions">
                      <button 
                        className="btn btn-danger" 
                        onClick={() => deleteAppointment(appointment.id)}
                      >
                        <FaTrash /> Cancel
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </SideBar>
  );
};

export default Appointments;