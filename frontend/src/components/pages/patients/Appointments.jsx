import React, { useState, useEffect } from 'react';
import { FaHeartbeat, FaList, FaTrash, FaCalendarDay, FaClock, FaCalendarCheck } from 'react-icons/fa';
import SideBar from '../../PatientSideBar';
import '../../../App.css';
import './Appointments.css';

// Define the backend URL
const BACKEND_URL = 'http://localhost:3500';

const Appointments = () => {
  // State for appointments
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientId, setPatientId] = useState(null);

  // Fetch patient ID
  useEffect(() => {
    const fetchPatientId = async () => {
      try {
        console.log("Fetching patient profile...");
        // Try the API endpoint for patient profile
        const response = await fetch(`${BACKEND_URL}/api/patient/profile`, {
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Patient profile data:", data);
          setPatientId(data.patient_id);
        } else {
          console.warn("Failed to fetch patient profile, using default patient ID");
          setPatientId(1); // Default patient ID for testing
        }
      } catch (err) {
        console.error("Error fetching patient profile:", err);
        setPatientId(1); // Default patient ID for testing
      }
    };

    fetchPatientId();
  }, []);

  // Fetch appointments from API
  useEffect(() => {
    if (!patientId) return;

    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching appointments for patient ID:", patientId);

        // Try the main endpoint first
        let response = await fetch(`${BACKEND_URL}/api/patient/appointments`, {
          credentials: 'include'
        });

        // If the main endpoint fails, try a direct database query
        if (!response.ok) {
          console.log("Main endpoint failed, trying direct query");
          response = await fetch(`${BACKEND_URL}/api/appointments?patientId=${patientId}`, {
            credentials: 'include'
          });
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Appointments data:", data);

        // Transform the data to match our component's expected format
        const formattedAppointments = data.map(appointment => ({
          id: appointment.appointment_id,
          clientName: appointment.first_name ? `${appointment.first_name} ${appointment.last_name}` : "Dr. Unknown",
          appointmentDate: new Date(appointment.scheduled_time).toISOString().split('T')[0],
          appointmentTime: new Date(appointment.scheduled_time).toTimeString().slice(0, 5),
          therapyType: appointment.appointment_type || "Therapy Session",
          notes: appointment.notes || "",
          status: appointment.status
        }));

        setAppointments(formattedAppointments);
        setError(null);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments. Please try again later.');

        // Use empty array for appointments if there's an error
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId]);

  // Cancel an appointment
  const deleteAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        console.log("Cancelling appointment with ID:", id);

        // Call the API to update the appointment status
        const response = await fetch(`${BACKEND_URL}/api/appointments/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            status: 'cancelled',
            cancellationReason: 'Cancelled by patient'
          })
        });

        if (!response.ok) {
          throw new Error('Failed to cancel appointment');
        }

        // Update local state
        setAppointments(prev =>
          prev.map(appointment =>
            appointment.id === id
              ? { ...appointment, status: 'cancelled' }
              : appointment
          )
        );

        alert('Appointment cancelled successfully');
      } catch (error) {
        console.error('Error cancelling appointment:', error);
        alert('Failed to cancel appointment. Please try again.');
      }
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
          <p>View your confirmed therapy appointments</p>
        </header>

        <div className="app-content">
          {/* Appointments List Section */}
          <section className="appointments-section">
            <h2><FaList /> Your Confirmed Appointments</h2>
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
                <option value="all">All Types</option>
                <option value="Pregnancy Therapy">Pregnancy Therapy</option>
                <option value="Postpartum Therapy">Postpartum Therapy</option>
                <option value="Trying to conceive Therapy">Trying to Conceive Therapy</option>
                <option value="Couples Therapy">Couples Therapy</option>
                <option value="Pregnancy Loss Therapy">Pregnancy Loss Therapy</option>
                <option value="Family Planning Therapy">Family Planning Therapy</option>
              </select>
            </div>

            {isLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading your appointments...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="appointments-list">
                {filteredAppointments.length === 0 ? (
                  <div className="empty-state">
                    <FaCalendarCheck />
                    <p>{appointments.length === 0 ? 'No confirmed appointments yet' : 'No appointments found matching your criteria'}</p>
                  </div>
                ) : (
                  filteredAppointments.map(appointment => (
                    <div key={appointment.id} className={`appointment-card ${appointment.status}`}>
                      <h3>{appointment.clientName}</h3>
                      <div className="appointment-meta">
                        <span><FaCalendarDay /> {formatDate(appointment.appointmentDate)}</span>
                        <span><FaClock /> {formatTime(appointment.appointmentTime)}</span>
                      </div>
                      <div className="appointment-type">{appointment.therapyType}</div>
                      <div className="appointment-status">
                        Status: <span className={`status-badge ${appointment.status}`}>{appointment.status}</span>
                      </div>
                      {appointment.notes && <p className="appointment-notes">{appointment.notes}</p>}
                      {appointment.status === 'pending' || appointment.status === 'scheduled' ? (
                        <div className="appointment-actions">
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteAppointment(appointment.id)}
                          >
                            <FaTrash /> Cancel
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </SideBar>
  );
};

export default Appointments;