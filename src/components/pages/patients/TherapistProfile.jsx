import React from 'react';
import SideBar from '../../sideBar';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiStar, FiClock, FiMapPin, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const TherapistProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('about');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState(null);

  // Sample therapist data with fixed duplicate reviews property
  const therapist = {
    id: 1,
    name: "Dr. Emily Johnson",
    specialization: "Postpartum Depression Specialist",
    bio: "Licensed clinical psychologist with 10+ years of experience helping mothers navigate mental health challenges...",
    credentials: [
      "PhD in Clinical Psychology (UCLA)",
      "Certified in Perinatal Mental Health (PSI)",
      "Licensed in California (PSY29861)"
    ],
    approach: "I use an integrative approach combining Cognitive Behavioral Therapy (CBT)...",
    rating: 4.8,
    reviewCount: 127, // Changed from 'reviews' to 'reviewCount'
    sessionFee: 85,
    photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
    languages: ["English", "Spanish"],
    availability: {
      monday: ["9:00 AM", "2:00 PM"],
      wednesday: ["10:00 AM", "3:00 PM"],
      friday: ["11:00 AM", "4:00 PM"]
    },
    reviews: [ // This is now the only reviews property (array of review objects)
      {
        id: 1,
        patient: "Sarah M.",
        rating: 5,
        date: "2023-06-15",
        comment: "Dr. Johnson helped me through severe postpartum anxiety...",
        avatar: "https://randomuser.me/api/portraits/women/43.jpg"
      },
      {
        id: 2,
        patient: "Jessica T.",
        rating: 4,
        date: "2023-05-22",
        comment: "Very professional and caring...",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg"
      }
    ],
    stats: {
      yearsExperience: 12,
      patientsHelped: 450,
      satisfactionRate: 98
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  // Availability Calendar Component
  const AvailabilityCalendar = ({ availability, onSelectSlot }) => {
    const days = [
      { name: 'Monday', slots: availability.monday },
      { name: 'Tuesday', slots: [] },
      { name: 'Wednesday', slots: availability.wednesday },
      { name: 'Thursday', slots: [] },
      { name: 'Friday', slots: availability.friday },
      { name: 'Saturday', slots: [] },
      { name: 'Sunday', slots: [] }
    ];

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {days.map((day, index) => (
            <div key={index} className="text-center font-medium text-sm text-gray-500">
              {day.name.substring(0, 3)}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="min-h-20">
              {day.slots.length > 0 ? (
                <div className="space-y-1">
                  {day.slots.map((slot, slotIndex) => (
                    <button
                      key={slotIndex}
                      onClick={() => onSelectSlot({
                        day: day.name,
                        time: slot,
                        date: new Date()
                      })}
                      className="w-full text-xs p-1 bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <span className="text-xs text-gray-400">Unavailable</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Review Card Component
  const ReviewCard = ({ review }) => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-start">
          <img 
            src={review.avatar} 
            alt={review.patient}
            className="w-10 h-10 rounded-full mr-3"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-900">{review.patient}</h4>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <p className="mt-2 text-gray-700 text-sm">{review.comment}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <SideBar>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50">
        {/* Header Section */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Top Banner */}
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <Link 
                    to="/therapists" 
                    className="inline-flex items-center text-purple-100 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Therapists
                  </Link>
                </div>
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
                >
                  <svg 
                    className={`w-6 h-6 ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-white'}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Profile Section */}
            <div className="relative px-6 pt-16 pb-6">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={slideUp}
                className="absolute -top-12 left-6 w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden"
              >
                <img 
                  src={therapist.photo} 
                  alt={therapist.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <div className="ml-32">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{therapist.name}</h1>
                    <p className="text-purple-600 font-medium">{therapist.specialization}</p>
                  </div>
                  <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                    <FiStar className="text-yellow-400 fill-current" />
                    <span className="ml-1 font-medium">{therapist.rating}</span>
                    <span className="text-gray-500 ml-1">({therapist.reviewCount})</span>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <FiCheckCircle className="mr-1" />
                    Verified Professional
                  </span>
                  {therapist.languages.map(lang => (
                    <span key={lang} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="px-6 pb-6">
              <div className="grid grid-cols-3 divide-x divide-gray-200 bg-white rounded-xl shadow-sm p-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{therapist.stats.yearsExperience}+</p>
                  <p className="text-xs text-gray-500">Years Experience</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{therapist.stats.patientsHelped}+</p>
                  <p className="text-xs text-gray-500">Mothers Helped</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">{therapist.stats.satisfactionRate}%</p>
                  <p className="text-xs text-gray-500">Satisfaction Rate</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-6 grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowBookingModal(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                Book Session
              </button>
              <button className="bg-white border border-indigo-500 text-indigo-600 py-3 px-4 rounded-xl font-medium shadow-sm hover:bg-indigo-50 transition-colors">
                Send Message
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 px-6">
              <nav className="flex space-x-8">
                {['about', 'approach', 'availability', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <AnimatePresence mode='wait'>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'about' && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">About Dr. Johnson</h2>
                      <p className="text-gray-700 mb-6">{therapist.bio}</p>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Credentials</h3>
                      <ul className="space-y-2 mb-6">
                        {therapist.credentials.map((cred, i) => (
                          <li key={i} className="flex items-start">
                            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-gray-700">{cred}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="bg-indigo-50 rounded-xl p-4">
                        <h3 className="font-semibold text-indigo-800 mb-2">Session Fee</h3>
                        <div className="flex items-baseline">
                          <span className="text-3xl font-bold text-indigo-600">${therapist.sessionFee}</span>
                          <span className="ml-1 text-gray-600">/ 50-min session</span>
                        </div>
                        <p className="text-sm text-indigo-700 mt-1">Subsidized rate available for qualifying patients</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'approach' && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">Therapeutic Approach</h2>
                      <p className="text-gray-700 mb-6">{therapist.approach}</p>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm">
                          <h3 className="font-semibold text-purple-700 mb-2 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            Focus Areas
                          </h3>
                          <ul className="space-y-2">
                            {['Postpartum Depression', 'Pregnancy Anxiety', 'Birth Trauma', 'Transition to Motherhood'].map((item, i) => (
                              <li key={i} className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2"></div>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                          <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Treatment Methods
                          </h3>
                          <ul className="space-y-2">
                            {['Cognitive Behavioral Therapy (CBT)', 'Mindfulness-Based', 'Trauma-Informed', 'Solution-Focused'].map((item, i) => (
                              <li key={i} className="flex items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'availability' && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-3">Availability</h2>
                      <p className="text-gray-700 mb-6">All times shown in your local timezone</p>
                      
                      <AvailabilityCalendar 
                        availability={therapist.availability} 
                        onSelectSlot={(slot) => {
                          setSelectedAvailability(slot);
                          setShowBookingModal(true);
                        }}
                      />
                      
                      <div className="mt-6 flex items-center text-sm text-gray-500">
                        <FiClock className="mr-2" />
                        <span>Typical response time: 2 hours</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Patient Reviews</h2>
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Write a Review
                        </button>
                      </div>
                      
                      {therapist.reviews.length > 0 ? (
                        <div className="space-y-6">
                          {therapist.reviews.map(review => (
                            <ReviewCard key={review.id} review={review} />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                          </svg>
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
                          <p className="mt-1 text-sm text-gray-500">Be the first to share your experience with this therapist.</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        <AnimatePresence>
          {showBookingModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowBookingModal(false)}
            >
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-indigo-600 p-4 text-white">
                  <h3 className="text-lg font-medium">Book a Session</h3>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start mb-6">
                    <img 
                      src={therapist.photo} 
                      alt={therapist.name}
                      className="w-16 h-16 rounded-lg object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-medium">{therapist.name}</h4>
                      <p className="text-indigo-600 text-sm">{therapist.specialization}</p>
                      <p className="text-gray-700 font-medium mt-1">${therapist.sessionFee} per session</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Session Type</label>
                      <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option>Video Session (50 min)</option>
                        <option>Phone Session (50 min)</option>
                        <option>In-Person (Los Angeles office)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                      <div className="bg-gray-50 p-3 rounded-md">
                        {selectedAvailability ? (
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{selectedAvailability.day}</p>
                              <p className="text-sm text-gray-600">at {selectedAvailability.time}</p>
                            </div>
                            <button 
                              onClick={() => setSelectedAvailability(null)}
                              className="text-indigo-600 hover:text-indigo-800 text-sm"
                            >
                              Change
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => {
                              setShowBookingModal(false);
                              setActiveTab('availability');
                            }}
                            className="w-full text-left text-indigo-600 hover:text-indigo-800"
                          >
                            Select availability
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                      <div className="space-y-2">
                        <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="payment" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                          <span className="ml-3 block text-sm font-medium text-gray-700">
                            Credit/Debit Card
                          </span>
                        </label>
                        <label className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="payment" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500" />
                          <span className="ml-3 block text-sm font-medium text-gray-700">
                            Insurance (verify coverage)
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={() => setShowBookingModal(false)}
                      className="flex-1 bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1 bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SideBar>
  );
};

export default TherapistProfile;