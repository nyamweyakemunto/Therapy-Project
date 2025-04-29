import React, { useState } from 'react';
import SideBar from '../../TherapistSideBar';

const TherapistAvailability = () => {
  // State for availability slots
  const [availability, setAvailability] = useState({
    Monday: [
      { time: '9:00 AM - 10:00 AM', available: false },
      { time: '10:00 AM - 11:00 AM', available: true },
      { time: '2:00 PM - 3:00 PM', available: true },
    ],
    Tuesday: [
      { time: '9:00 AM - 10:00 AM', available: true },
      { time: '11:00 AM - 12:00 PM', available: true },
    ],
    Wednesday: [
      { time: '10:00 AM - 11:00 AM', available: true },
      { time: '4:00 PM - 5:00 PM', available: false },
    ],
    Thursday: [
      { time: '1:00 PM - 2:00 PM', available: true },
      { time: '3:00 PM - 4:00 PM', available: true },
    ],
    Friday: [
      { time: '9:00 AM - 10:00 AM', available: true },
      { time: '2:00 PM - 3:00 PM', available: false },
    ],
  });

  // State for adding new slots
  const [newSlot, setNewSlot] = useState({
    day: 'Monday',
    time: '',
    available: true
  });

  // Toggle availability of a slot
  const toggleAvailability = (day, index) => {
    const updatedAvailability = { ...availability };
    updatedAvailability[day][index].available = !updatedAvailability[day][index].available;
    setAvailability(updatedAvailability);
  };

  // Add a new time slot
  const addTimeSlot = () => {
    if (!newSlot.time) return;
    
    const updatedAvailability = { ...availability };
    updatedAvailability[newSlot.day].push({
      time: newSlot.time,
      available: newSlot.available
    });
    
    setAvailability(updatedAvailability);
    setNewSlot({ ...newSlot, time: '' });
  };

  // Remove a time slot
  const removeTimeSlot = (day, index) => {
    const updatedAvailability = { ...availability };
    updatedAvailability[day].splice(index, 1);
    setAvailability(updatedAvailability);
  };

  // CSS styles
  const styles = {
    container: {
      fontFamily: "'Arial', sans-serif",
      maxWidth: '1000px',
      margin: '20px auto',
      padding: '20px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    header: {
      color: '#2c3e50',
      textAlign: 'center',
      marginBottom: '30px',
      borderBottom: '2px solid #3498db',
      paddingBottom: '10px',
    },
    daySection: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '15px',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    dayHeader: {
      color: '#3498db',
      marginTop: '0',
      marginBottom: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    slotList: {
      listStyle: 'none',
      padding: '0',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
    },
    slotItem: {
      backgroundColor: '#ecf0f1',
      padding: '10px 15px',
      borderRadius: '5px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minWidth: '200px',
    },
    availableSlot: {
      backgroundColor: '#d4edda',
      borderLeft: '4px solid #28a745',
    },
    unavailableSlot: {
      backgroundColor: '#f8d7da',
      borderLeft: '4px solid #dc3545',
    },
    toggleButton: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '5px 10px',
      cursor: 'pointer',
      marginLeft: '10px',
    },
    removeButton: {
      backgroundColor: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '5px 10px',
      cursor: 'pointer',
      marginLeft: '10px',
    },
    addSlotForm: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    input: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
      flex: '1',
      minWidth: '200px',
    },
    select: {
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    addButton: {
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 15px',
      cursor: 'pointer',
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    checkbox: {
      marginLeft: '10px',
    },
  };

  return (
    <SideBar>
      <div style={styles.container}>
        <h1 style={styles.header}>Therapist Availability</h1>
        
        {Object.entries(availability).map(([day, slots]) => (
          <div key={day} style={styles.daySection}>
            <h2 style={styles.dayHeader}>
              {day}
              <span>{slots.filter(slot => slot.available).length} available slots</span>
            </h2>
            
            <ul style={styles.slotList}>
              {slots.map((slot, index) => (
                <li 
                  key={index} 
                  style={{
                    ...styles.slotItem,
                    ...(slot.available ? styles.availableSlot : styles.unavailableSlot)
                  }}
                >
                  {slot.time}
                  <div>
                    <button 
                      style={styles.toggleButton}
                      onClick={() => toggleAvailability(day, index)}
                    >
                      {slot.available ? 'Mark Unavailable' : 'Mark Available'}
                    </button>
                    <button 
                      style={styles.removeButton}
                      onClick={() => removeTimeSlot(day, index)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        <div style={styles.daySection}>
          <h2 style={styles.dayHeader}>Add New Time Slot</h2>
          <div style={styles.addSlotForm}>
            <select 
              style={styles.select}
              value={newSlot.day}
              onChange={(e) => setNewSlot({...newSlot, day: e.target.value})}
            >
              {Object.keys(availability).map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            
            <input
              style={styles.input}
              type="text"
              placeholder="Time slot (e.g., 9:00 AM - 10:00 AM)"
              value={newSlot.time}
              onChange={(e) => setNewSlot({...newSlot, time: e.target.value})}
            />
            
            <div style={styles.checkboxContainer}>
              <label>Available:</label>
              <input
                style={styles.checkbox}
                type="checkbox"
                checked={newSlot.available}
                onChange={(e) => setNewSlot({...newSlot, available: e.target.checked})}
              />
            </div>
            
            <button style={styles.addButton} onClick={addTimeSlot}>
              Add Slot
            </button>
          </div>
        </div>
      </div>
    </SideBar>
  );
};

export default TherapistAvailability;