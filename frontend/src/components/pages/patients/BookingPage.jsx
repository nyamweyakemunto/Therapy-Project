import React, { useState } from 'react';
import { FaHeartbeat, FaCalendarPlus, FaSave, FaUserMd, FaRegClock, FaNotesMedical } from 'react-icons/fa';
import { GiBrain } from 'react-icons/gi';
import { MdOutlinePsychology } from 'react-icons/md';
import SideBar from "../../PatientSideBar";

const therapists = [
  { 
    id: 1, 
    name: "Dr. Kemunto Nyamweya", 
    specialty: "Anxiety & Stress", 
    availableSlots: ["10:00", "14:00", "17:00"],
    therapyTypes: ["Pregnancy Therapy", "Postpartum Therapy"],
    experience: "8 years",
    approach: "Cognitive Behavioral Therapy",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
  { 
    id: 2, 
    name: "Dr. Njoki Nyamweya", 
    specialty: "Depression & PTSD", 
    availableSlots: ["11:00", "15:00"],
    therapyTypes: ["Couples Therapy", "Pregnancy Loss Therapy"],
    experience: "12 years",
    approach: "Psychodynamic Therapy",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  },
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

  const [selectedTherapist, setSelectedTherapist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      therapist: therapist.name
    }));
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newAppointment = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };

    const savedAppointments = JSON.parse(localStorage.getItem('therapyAppointments')) || [];
    localStorage.setItem('therapyAppointments', JSON.stringify([...savedAppointments, newAppointment]));

    setFormData({
      clientName: '',
      appointmentDate: '',
      appointmentTime: '',
      therapyType: '',
      notes: '',
      therapist: ''
    });

    setIsModalOpen(false);
    alert('Appointment booked successfully!');
  };

  const formatTimeDisplay = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {therapists.map((therapist) => (
                <div 
                  key={therapist.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-xl"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img 
                        src={therapist.image} 
                        alt={therapist.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{therapist.name}</h3>
                        <span className="ml-auto bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                          {therapist.experience} exp
                        </span>
                      </div>
                      
                      <div className="flex items-center text-yellow-600 mb-3">
                        <GiBrain className="mr-1" />
                        <span className="font-medium">{therapist.specialty}</span>
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
                              {type}
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
          </div>

          {/* Booking Modal */}
          {isModalOpen && selectedTherapist && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
                  <h2 className="text-2xl font-bold flex items-center">
                    <FaUserMd className="mr-2" />
                    Book with {selectedTherapist.name}
                  </h2>
                  <p className="text-purple-100">{selectedTherapist.specialty}</p>
                </div>
                
                {/* Modal Body */}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    
                    {/* Time Field */}
                    <div>
                      <label className="flex items-center text-gray-700 font-medium mb-1">
                        <FaRegClock className="mr-2 text-purple-600" />
                        Appointment Time
                      </label>
                      <select
                        id="appointmentTime"
                        value={formData.appointmentTime}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Select a time</option>
                        {selectedTherapist.availableSlots.map((slot, index) => (
                          <option key={index} value={slot}>
                            {formatTimeDisplay(slot)}
                          </option>
                        ))}
                      </select>
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
                          <option key={index} value={type}>{type}</option>
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
                      className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all flex items-center justify-center"
                    >
                      <FaSave className="mr-2" />
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </SideBar>
  );
};

export default BookingPage;