import React, { useState, useEffect } from 'react';
import SideBar from '../../TherapistSideBar';
import { FiUser, FiLock, FiMail, FiPhone, FiMapPin, FiBriefcase, FiAward, FiCalendar, FiUpload } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import avatarPlaceholder from './assets/alexander-hipp-iEEBWgY_6lA-unsplash.jpg';

const TherapistProfileManagement = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    profilePicture: null,
    credentials: [],
    treatmentMethods: [],
    languages: [{ language: 'English', proficiency: 'fluent' }],
    availability: [],
    focusAreas: [],
    profileCompletion: 0
  });

  // Parse JSON fields from database
  const parseJsonField = (field) => {
    try {
      return field ? JSON.parse(field) : [];
    } catch {
      return [];
    }
  };

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/therapist/profile', {
          credentials: 'include'
        });
        const data = await response.json();
        if (response.ok) {
          setProfileData({
            name: data.name,
            specialization: data.specialization,
            email: data.email,
            phone: data.phone,
            address: data.address,
            bio: data.bio,
            profilePicture: data.profile_picture_url,
            credentials: parseJsonField(data.credentials),
            treatmentMethods: parseJsonField(data.treatment_methods),
            languages: parseJsonField(data.languages),
            availability: data.availability || [],
            focusAreas: data.specializations || [],
            profileCompletion: calculateProfileCompletion(data)
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  // Calculate profile completion percentage
  const calculateProfileCompletion = (profile) => {
    const requiredFields = [
      'name', 'specialization', 'email', 'phone', 'bio', 
      'credentials', 'treatmentMethods', 'languages', 'availability'
    ];
    const completedFields = requiredFields.filter(field => {
      if (Array.isArray(profile[field])) {
        return profile[field].length > 0;
      }
      return !!profile[field];
    }).length;
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  // Handle saving profile data
  const handleSave = async () => {
    try {
      const response = await fetch('/api/therapist/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          phone: profileData.phone,
          address: profileData.address,
          bio: profileData.bio,
          profile_picture_url: profileData.profilePicture,
          credentials: JSON.stringify(profileData.credentials),
          treatment_methods: JSON.stringify(profileData.treatmentMethods),
          languages: JSON.stringify(profileData.languages),
          specializations: profileData.focusAreas,
          availability: profileData.availability
        })
      });
      
      if (response.ok) {
        setEditMode(false);
        const updatedData = await response.json();
        setProfileData(prev => ({
          ...prev,
          profileCompletion: calculateProfileCompletion(updatedData)
        }));
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };
  
  
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <SideBar>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        {/* Profile Header with Floating Elements */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-indigo-100 opacity-30"></div>
          <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-purple-100 opacity-30"></div>
          
          <div className="relative z-10 p-6 flex flex-col md:flex-row items-start md:items-center">
            {/* Avatar with Upload Capability */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="relative group mb-4 md:mb-0 md:mr-6"
            >
              <img 
                src={avatarPlaceholder} 
                alt="Profile" 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              {editMode && (
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <FiUpload className="text-white text-xl" />
                  <input type="file" className="hidden" />
                </label>
              )}
            </motion.div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        className="bg-blue-50 border-b-2 border-indigo-500 px-2 py-1 rounded-t"
                      />
                    ) : (
                      profileData.name
                    )}
                  </h1>
                  <p className="text-purple-600 font-medium">
                    {editMode ? (
                      <input
                        type="text"
                        name="specialization"
                        value={profileData.specialization}
                        onChange={handleInputChange}
                        className="bg-blue-50 border-b-2 border-indigo-500 px-2 py-1 rounded-t mt-2 w-full"
                      />
                    ) : (
                      profileData.specialization
                    )}
                  </p>
                </div>
                
                {/* Profile Completion Meter */}
                <div className="mt-4 md:mt-0">
                  <div className="flex items-center">
                    <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500" 
                        style={{ width: `${profileData.profileCompletion}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{profileData.profileCompletion}% complete</span>
                  </div>
                </div>
              </div>
              
              {/* Edit/Save Buttons */}
              <div className="mt-4 flex space-x-3">
                {!editMode ? (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                  >
                    Edit Profile
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-sm hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
          <nav className="flex overflow-x-auto">
            {[
              { id: 'personal', icon: <FiUser className="mr-2" />, label: 'Personal Info' },
              { id: 'professional', icon: <FiBriefcase className="mr-2" />, label: 'Professional' },
              { id: 'availability', icon: <FiCalendar className="mr-2" />, label: 'Availability' },
              { id: 'security', icon: <FiLock className="mr-2" />, label: 'Security' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id 
                    ? 'text-indigo-600 border-b-2 border-indigo-600' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                        <FiMail size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        {editMode ? (
                          <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleInputChange}
                            className="w-full mt-1 px-3 py-2 bg-blue-50 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        ) : (
                          <p className="text-gray-800">{profileData.email}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                        <FiPhone size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                        {editMode ? (
                          <input
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleInputChange}
                            className="w-full mt-1 px-3 py-2 bg-blue-50 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        ) : (
                          <p className="text-gray-800">{profileData.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <div className="p-3 rounded-lg bg-blue-100 text-blue-600 mr-4">
                        <FiMapPin size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-500">Address</h3>
                        {editMode ? (
                          <textarea
                            name="address"
                            value={profileData.address}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full mt-1 px-3 py-2 bg-blue-50 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          />
                        ) : (
                          <p className="text-gray-800">{profileData.address}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Bio</h3>
                    {editMode ? (
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-3 py-2 bg-blue-50 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    ) : (
                      <p className="text-gray-800 whitespace-pre-line">{profileData.bio}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Professional Tab */}
              {activeTab === 'professional' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Credentials & Qualifications</h3>
                  {editMode ? (
                    <div className="space-y-4">
                      {profileData.credentials.map((credential, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            type="text"
                            value={credential}
                            onChange={(e) => {
                              const newCredentials = [...profileData.credentials];
                              newCredentials[index] = e.target.value;
                              setProfileData({...profileData, credentials: newCredentials});
                            }}
                            className="flex-1 px-3 py-2 bg-blue-50 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <button
                            onClick={() => {
                              const newCredentials = [...profileData.credentials];
                              newCredentials.splice(index, 1);
                              setProfileData({...profileData, credentials: newCredentials});
                            }}
                            className="ml-2 p-2 text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setProfileData({
                          ...profileData, 
                          credentials: [...profileData.credentials, '']
                        })}
                        className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                      >
                        + Add Credential
                      </button>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {profileData.credentials.map((credential, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2 mt-0.5">
                            <FiAward />
                          </div>
                          <span className="text-gray-800">{credential}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              
              {/* Availability Tab */}
              {activeTab === 'availability' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Working Hours</h3>
                  {editMode ? (
                    <div className="space-y-4">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <div key={day} className="flex items-center">
                          <label className="w-24 font-medium text-gray-700">{day}</label>
                          <div className="flex-1 flex items-center space-x-2">
                            <select className="px-3 py-2 bg-blue-50 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                              <option>Not Available</option>
                              {['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'].map(time => (
                                <option key={time}>{time}</option>
                              ))}
                            </select>
                            <span>to</span>
                            <select className="px-3 py-2 bg-blue-50 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                              <option>Not Available</option>
                              {['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'].map(time => (
                                <option key={time}>{time}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profileData.availability.map((slot, index) => (
                        <div key={index} className="bg-blue-50 rounded-lg p-3 flex items-center">
                          <FiCalendar className="text-blue-500 mr-3" />
                          <span className="font-medium text-gray-800">{slot}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600">Add an extra layer of security to your account</p>
                        <p className="text-sm text-gray-500 mt-1">Currently: <span className="font-medium text-red-600">Disabled</span></p>
                      </div>
                      <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors">
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SideBar>
  );
};

export default TherapistProfileManagement;