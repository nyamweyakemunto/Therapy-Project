import React, { useState } from 'react';
import SideBar from '../../PatientSideBar';
import { FaAmbulance, FaHospital, FaPhoneAlt, FaUserMd } from 'react-icons/fa';
import { IoIosWarning } from 'react-icons/io';

const PatientEmergency = () => {
  const [emergencyType, setEmergencyType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const emergencyTypes = [
    { id: 'medical', label: 'Medical Emergency', icon: <FaUserMd className="text-red-500" /> },
    { id: 'accident', label: 'Accident', icon: <FaAmbulance className="text-orange-500" /> },
    { id: 'mental-health', label: 'Mental Health Crisis', icon: <IoIosWarning className="text-yellow-500" /> },
    { id: 'other', label: 'Other Emergency', icon: <FaHospital className="text-purple-500" /> },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Emergency alert sent! Type: ${emergencyType}, Location: ${location}`);
    // Here you would typically send this data to your backend/emergency services
  };

  return (
    <SideBar>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 text-white">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <IoIosWarning className="text-yellow-300" />
              Emergency Assistance
            </h1>
            <p className="mt-2 opacity-90">
              Please provide details about your emergency situation. Help is on the way!
            </p>
          </div>

          {/* Emergency Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Emergency Type Selection */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Type of Emergency</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {emergencyTypes.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setEmergencyType(type.id)}
                    className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all ${emergencyType === type.id ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300'}`}
                  >
                    <span className="text-2xl mb-2">{type.icon}</span>
                    <span className="font-medium text-gray-700">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location Input */}
            <div className="space-y-2">
              <label htmlFor="location" className="block text-lg font-medium text-gray-700">
                Your Current Location
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="E.g., 123 Main St, City"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-lg font-medium text-gray-700">
                Emergency Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe the emergency situation..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            {/* Emergency Contacts */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <h3 className="font-bold text-yellow-800 mb-2">Immediate Contacts</h3>
              <div className="flex flex-wrap gap-4">
                <a href="tel:911" className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
                  <FaPhoneAlt /> Call 911 (US)
                </a>
                <a href="tel:112" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  <FaPhoneAlt /> Call 112 (EU)
                </a>
                <a href="tel:999" className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                  <FaPhoneAlt /> Call 999 (UK)
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-200 flex items-center justify-center gap-2"
            >
              <IoIosWarning className="text-xl" />
              Send Emergency Alert
            </button>
          </form>

          {/* Footer Note */}
          <div className="bg-gray-50 p-4 text-center text-gray-600 text-sm">
            <p>By submitting this form, you agree to our emergency response protocols.</p>
            <p className="mt-1">Our team will contact you immediately after receiving your alert.</p>
          </div>
        </div>
      </div>
    </SideBar>
  );
};

export default PatientEmergency;