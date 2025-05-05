import React, { useState, useEffect } from 'react';
import { FaHeartbeat, FaCalendarPlus, FaSave, FaUserMd, FaRegClock, FaNotesMedical, FaSpinner } from 'react-icons/fa';
import { GiBrain } from 'react-icons/gi';
import { MdOutlinePsychology } from 'react-icons/md';
import SideBar from "../../PatientSideBar";
import axios from 'axios';

// Configure API base URL
const api = axios.create({
  baseURL: 'http://localhost:3500/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Mock profile pictures to maintain UI design
const mockProfilePictures = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
];

const BookingPage = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    appointmentDate: '',
    appointmentTime: '',
    therapyType: '',
    notes: '',
    therapist: ''
  });

  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        setLoading(true);
        const response = await api.get('/therapists');
        const therapistsWithPhotos = response.data.map((therapist, index) => ({
          ...therapist,
          profile_picture: mockProfilePictures[index % mockProfilePictures.length],
          therapyTypes: therapist.specializations || [],
          availableSlots: therapist.availability ? 
            therapist.availability.map(a => a.start_time.substring(0, 5)) : []
        }));
        setTherapists(therapistsWithPhotos);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load therapists');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  useEffect(() => {
    if (formData.appointmentDate && selectedTherapist) {
      const fetchAvailability = async () => {
        try {
          setLoadingSlots(true);
          const response = await api.get(
            `/therapists/${selectedTherapist.therapist_id}/availability`,
            { params: { date: formData.appointmentDate } }
          );
          setAvailableSlots(response.data.available_slots || []);
        } catch (err) {
          console.error('Availability Error:', err);
          setAvailableSlots([]);
        } finally {
          setLoadingSlots(false);
        }
      };

      fetchAvailability();
    }
  }, [formData.appointmentDate, selectedTherapist]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleTherapistSelect = (therapist) => {
    setSelectedTherapist(therapist);
    setFormData(prev => ({
      ...prev,
      therapist: `${therapist.first_name} ${therapist.last_name}`,
      therapyType: therapist.therapyTypes[0] || ''
    }));
    setIsModalOpen(true);
    setBookingSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const appointmentData = {
        patient_id: 1, // In a real app, get from auth context
        therapist_id: selectedTherapist.therapist_id,
        date: formData.appointmentDate,
        time: formData.appointmentTime,
        duration_minutes: 60,
        notes: formData.notes,
        therapy_type: formData.therapyType
      };

      await api.post('/appointments', appointmentData);
      
      setFormData({
        clientName: '',
        appointmentDate: '',
        appointmentTime: '',
        therapyType: '',
        notes: '',
        therapist: ''
      });
      
      setBookingSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setBookingSuccess(false);
      }, 2000);
      
    } catch (err) {
      console.error('Booking Error:', err);
      alert(err.response?.data?.error || 'Booking failed. Please try again.');
    }
  };

  const formatTimeDisplay = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatSpecialization = (spec) => {
    return spec
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <SideBar>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-purple-600 mb-4 mx-auto" />
            <p className="text-lg text-purple-800">Loading therapists...</p>
          </div>
        </div>
      </SideBar>
    );
  }

  if (error) {
    return (
      <SideBar>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </SideBar>
    );
  }

  return (
    <SideBar>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg mb-4">
              <FaHeartbeat className="text-3xl mr-3" />
              <h1 className="text-3xl font-bold">Book a Therapy Session</h1>
            </div>
            <p className="text-lg text-purple-700 max-w-2xl mx-auto">
              Connect with our expert therapists and begin your journey to mental wellness
            </p>
          </div>

          {/* Therapists Grid */}
          <div className="mb-12">
            <h2 className="flex items-center text-2xl font-bold text-purple-800 mb-6">
              <MdOutlinePsychology className="mr-2 text-purple-600" />
              Meet Our Therapists
            </h2>
            
            {therapists.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                <p className="text-gray-600">No therapists available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {therapists.map((therapist) => (
                  <div 
                    key={therapist.therapist_id} 
                    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img 
                          src={therapist.profile_picture} 
                          alt={`${therapist.first_name} ${therapist.last_name}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-bold text-gray-800">
                            Dr. {therapist.first_name} {therapist.last_name}
                          </h3>
                        </div>
                        
                        <div className="flex items-center text-yellow-600 mb-3">
                          <GiBrain className="mr-1" />
                          <span className="font-medium">{therapist.specialization}</span>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Approach:</span> {therapist.approach}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {therapist.therapyTypes.map((type, index) => (
                              <span 
                                key={index} 
                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                              >
                                {formatSpecialization(type)}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleTherapistSelect(therapist)}
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                          Book Session
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking Modal */}
          {isModalOpen && selectedTherapist && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center">
                    <FaUserMd className="mr-2" />
                    Book with Dr. {selectedTherapist.first_name} {selectedTherapist.last_name}
                  </h2>
                  <p className="text-purple-100">{selectedTherapist.specialization}</p>
                </div>
                
                {/* Modal Body */}
                {bookingSuccess ? (
                  <div className="p-6 text-center">
                    <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4">
                      <h3 className="font-bold">Booking Confirmed!</h3>
                      <p>Your appointment has been successfully scheduled.</p>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-purple-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                      {/* Name Field */}
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Your Full Name</label>
                        <input
                          type="text"
                          id="clientName"
                          value={formData.clientName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Enter your name"
                        />
                      </div>
                      
                      {/* Date Field */}
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Appointment Date</label>
                        <input
                          type="date"
                          id="appointmentDate"
                          value={formData.appointmentDate}
                          onChange={handleInputChange}
                          required
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      
                      {/* Time Field */}
                      <div>
                        <label className="flex items-center text-gray-700 font-medium mb-1">
                          <FaRegClock className="mr-2 text-purple-600" />
                          Appointment Time
                        </label>
                        {loadingSlots ? (
                          <div className="flex items-center justify-center py-2">
                            <FaSpinner className="animate-spin text-purple-600 mr-2" />
                            <span>Loading available slots...</span>
                          </div>
                        ) : availableSlots.length > 0 ? (
                          <select
                            id="appointmentTime"
                            value={formData.appointmentTime}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          >
                            <option value="">Select a time</option>
                            {availableSlots.map((slot, index) => (
                              <option key={index} value={slot}>
                                {formatTimeDisplay(slot)}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div className="text-sm text-gray-500">
                            {formData.appointmentDate 
                              ? 'No available slots for this date' 
                              : 'Please select a date first'}
                          </div>
                        )}
                      </div>
                      
                      {/* Therapy Type */}
                      <div>
                        <label className="block text-gray-700 font-medium mb-1">Therapy Type</label>
                        <select
                          id="therapyType"
                          value={formData.therapyType}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Select a therapy type</option>
                          {selectedTherapist.therapyTypes.map((type, index) => (
                            <option key={index} value={type}>
                              {formatSpecialization(type)}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Notes Field */}
                      <div>
                        <label className="flex items-center text-gray-700 font-medium mb-1">
                          <FaNotesMedical className="mr-2 text-purple-600" />
                          Notes (Optional)
                        </label>
                        <textarea
                          id="notes"
                          value={formData.notes}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          rows="3"
                          placeholder="Any specific concerns or preferences..."
                        />
                      </div>
                    </div>
                    
                    {/* Modal Footer */}
                    <div className="mt-6 flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!formData.appointmentTime || loadingSlots}
                        className={`flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all flex items-center justify-center ${
                          (!formData.appointmentTime || loadingSlots) ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        <FaSave className="mr-2" />
                        Confirm Booking
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </SideBar>
  );
};

export default BookingPage;