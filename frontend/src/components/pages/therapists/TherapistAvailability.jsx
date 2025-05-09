import React, { useState, useEffect } from 'react';
import SideBar from '../../TherapistSideBar';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

// Backend URL constant
const BACKEND_URL = 'http://localhost:3500';

const TherapistAvailability = () => {
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSlot, setEditingSlot] = useState(null);
  const [therapistId, setTherapistId] = useState(null);

  // New slot form state
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 'monday',
    startTime: '09:00',
    endTime: '17:00',
    isRecurring: true
  });

  // Days of the week for dropdown
  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ];

  // Time slots for dropdown (30 min intervals)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const time = `${formattedHour}:${formattedMinute}`;
        options.push({ value: time, label: time });
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

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
          console.log("Setting therapist ID from profile:", data.therapist_id);
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
        console.log("Therapist data from second fetch:", therapistData);
        console.log("Setting therapist ID from second fetch:", therapistData.therapist_id);
        setTherapistId(therapistData.therapist_id);
      } catch (err) {
        console.error('Error fetching therapist ID:', err);
        setError('Could not load therapist information');
      } finally {
        setLoading(false);
      }
    };

    fetchTherapistId();
  }, []);

  // Fetch availability slots when therapistId is available
  useEffect(() => {
    if (!therapistId) return;

    const fetchAvailability = async () => {
      try {
        setLoading(true);
        // Use the dedicated test endpoint for availability management
        const response = await fetch(`${BACKEND_URL}/api/therapist/availability/manage/${therapistId}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch availability');
        }

        const data = await response.json();
        console.log('Initial availability data fetch:', data);
        setAvailabilitySlots(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching availability:', err);
        setError('Could not load availability slots');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [therapistId]);

  // Handle form input changes for new slot
  const handleNewSlotChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSlot(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle form input changes for editing slot
  const handleEditSlotChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingSlot(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Add new availability slot
  const handleAddSlot = async (e) => {
    e.preventDefault();

    try {
      console.log("Adding availability slot:", {...newSlot, therapistId});
      // Use the correct backend URL and endpoint
      const response = await fetch(`${BACKEND_URL}/api/therapist/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...newSlot,
          therapistId: therapistId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Check if this is an overlap error and provide a more user-friendly message
        if (errorData.message && errorData.message.includes('overlaps')) {
          // If we have conflicting slot details, include them in the error message
          if (errorData.conflictingSlot) {
            const slot = errorData.conflictingSlot;
            const day = slot.day_of_week.charAt(0).toUpperCase() + slot.day_of_week.slice(1);
            const start = slot.start_time.substring(0, 5);
            const end = slot.end_time.substring(0, 5);
            throw new Error(`This time slot overlaps with your existing availability on ${day} from ${start} to ${end}. Please choose a different time.`);
          } else {
            throw new Error(`This time slot overlaps with your existing availability. Please choose a different time.`);
          }
        } else {
          throw new Error(errorData.message || 'Failed to add availability slot');
        }
      }

      // Refresh availability slots
      console.log("Refreshing availability with therapistId:", therapistId);
      const updatedResponse = await fetch(`${BACKEND_URL}/api/therapist/availability/manage/${therapistId}`, {
        credentials: 'include'
      });

      if (!updatedResponse.ok) {
        throw new Error('Failed to fetch updated availability');
      }

      const updatedData = await updatedResponse.json();
      console.log('Refreshed availability data:', updatedData);
      setAvailabilitySlots(updatedData);

      // Reset form
      setNewSlot({
        dayOfWeek: 'monday',
        startTime: '09:00',
        endTime: '17:00',
        isRecurring: true
      });

      setError(null);
    } catch (err) {
      console.error('Error adding availability slot:', err);
      setError(err.message);
    }
  };

  // Start editing a slot
  const handleEditStart = (slot) => {
    setEditingSlot({
      ...slot,
      startTime: slot.start_time.substring(0, 5), // Format from HH:MM:SS to HH:MM
      endTime: slot.end_time.substring(0, 5),
      dayOfWeek: slot.day_of_week,
      isRecurring: !!slot.is_recurring
    });
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditingSlot(null);
  };

  // Save edited slot
  const handleEditSave = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/therapist/availability/${editingSlot.availability_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          dayOfWeek: editingSlot.dayOfWeek,
          startTime: editingSlot.startTime,
          endTime: editingSlot.endTime,
          isRecurring: editingSlot.isRecurring
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Check if this is an overlap error and provide a more user-friendly message
        if (errorData.message && errorData.message.includes('overlaps')) {
          // If we have conflicting slot details, include them in the error message
          if (errorData.conflictingSlot) {
            const slot = errorData.conflictingSlot;
            const day = slot.day_of_week.charAt(0).toUpperCase() + slot.day_of_week.slice(1);
            const start = slot.start_time.substring(0, 5);
            const end = slot.end_time.substring(0, 5);
            throw new Error(`This time slot overlaps with your existing availability on ${day} from ${start} to ${end}. Please choose a different time.`);
          } else {
            throw new Error(`This time slot overlaps with your existing availability. Please choose a different time.`);
          }
        } else {
          throw new Error(errorData.message || 'Failed to update availability slot');
        }
      }

      // Refresh availability slots
      const updatedResponse = await fetch(`${BACKEND_URL}/api/therapist/availability/manage/${therapistId}`, {
        credentials: 'include'
      });

      if (!updatedResponse.ok) {
        throw new Error('Failed to fetch updated availability');
      }

      const updatedData = await updatedResponse.json();
      setAvailabilitySlots(updatedData);

      // Exit edit mode
      setEditingSlot(null);
      setError(null);
    } catch (err) {
      console.error('Error updating availability slot:', err);
      setError(err.message);
    }
  };

  // Delete a slot
  const handleDeleteSlot = async (slotId) => {
    if (!window.confirm('Are you sure you want to delete this availability slot?')) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/therapist/availability/${slotId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete availability slot');
      }

      // Remove the deleted slot from state
      setAvailabilitySlots(prev => prev.filter(slot => slot.availability_id !== slotId));
      setError(null);
    } catch (err) {
      console.error('Error deleting availability slot:', err);
      setError(err.message);
    }
  };

  // Format time for display (HH:MM:SS -> HH:MM AM/PM)
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // We've replaced the inline styles with Tailwind CSS classes

  return (
    <SideBar>
      <div className="container mx-auto p-4">
        {/* Page Header */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Manage Your Availability</h1>
                <p className="text-gray-500 mt-1">Set your weekly schedule for patient appointments</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Changes are saved automatically</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex items-start">
            <div className="mr-3 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-lg">Error</p>
              <p className="mt-1">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 bg-white shadow-md rounded-lg p-8">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Loading your availability schedule...</p>
          </div>
        ) : (
          <>
            {/* Add new availability form - Redesigned */}
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold">Add New Availability</h2>
              </div>

              <form onSubmit={handleAddSlot} className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                  <p className="text-blue-700 text-sm mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Set your regular weekly availability. Patients will be able to book appointments during these hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Day of Week</label>
                    <select
                      name="dayOfWeek"
                      value={newSlot.dayOfWeek}
                      onChange={handleNewSlotChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      {daysOfWeek.map(day => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <select
                      name="startTime"
                      value={newSlot.startTime}
                      onChange={handleNewSlotChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      {timeOptions.map(time => (
                        <option key={time.value} value={time.value}>
                          {time.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <select
                      name="endTime"
                      value={newSlot.endTime}
                      onChange={handleNewSlotChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      {timeOptions.map(time => (
                        <option key={time.value} value={time.value}>
                          {time.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md flex items-center font-medium transition-colors duration-200"
                  >
                    <FaPlus className="mr-2" /> Add Availability Slot
                  </button>
                </div>
              </form>
            </div>

            {/* Availability slots list - New Card-Based Design */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Your Availability Schedule</h2>
                  <p className="text-gray-500 text-sm mt-1">These are the times you're available for patient appointments</p>
                </div>
              </div>

              {availabilitySlots.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-gray-700 text-xl font-medium mb-2">No availability slots set up yet</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">Your patients won't be able to book appointments until you set up your availability schedule.</p>
                  <button
                    onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Add Your First Slot
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availabilitySlots.map(slot => (
                    <div key={slot.availability_id} className={`rounded-lg overflow-hidden shadow-md border ${
                      editingSlot && editingSlot.availability_id === slot.availability_id
                        ? 'border-blue-400 ring-2 ring-blue-300'
                        : 'border-gray-200'
                    }`}>
                      {editingSlot && editingSlot.availability_id === slot.availability_id ? (
                        // Edit mode
                        <div className="p-4 bg-blue-50">
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                            <select
                              name="dayOfWeek"
                              value={editingSlot.dayOfWeek}
                              onChange={handleEditSlotChange}
                              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                            >
                              {daysOfWeek.map(day => (
                                <option key={day.value} value={day.value}>
                                  {day.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                              <select
                                name="startTime"
                                value={editingSlot.startTime}
                                onChange={handleEditSlotChange}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                              >
                                {timeOptions.map(time => (
                                  <option key={time.value} value={time.value}>
                                    {time.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                              <select
                                name="endTime"
                                value={editingSlot.endTime}
                                onChange={handleEditSlotChange}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                              >
                                {timeOptions.map(time => (
                                  <option key={time.value} value={time.value}>
                                    {time.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={handleEditCancel}
                              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center"
                            >
                              <FaTimes className="mr-1" /> Cancel
                            </button>
                            <button
                              onClick={handleEditSave}
                              className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
                            >
                              <FaSave className="mr-1" /> Save
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View mode
                        <>
                          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-white">
                            <h3 className="font-semibold text-lg capitalize">{slot.day_of_week}</h3>
                          </div>

                          <div className="p-4">
                            <div className="flex items-center justify-center mb-4">
                              <div className="text-center">
                                <div className="text-sm text-gray-500">Available Hours</div>
                                <div className="text-xl font-bold mt-1">
                                  {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between">
                              <button
                                onClick={() => handleEditStart(slot)}
                                className="flex items-center px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md"
                              >
                                <FaEdit className="mr-1" /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteSlot(slot.availability_id)}
                                className="flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-md"
                              >
                                <FaTrash className="mr-1" /> Delete
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </SideBar>
  );
};

export default TherapistAvailability;