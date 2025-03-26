import React from 'react'
import { useState, useEffect } from 'react';
import SideBar from '../../sideBar';
import { Link } from 'react-router-dom';

export default function PatientHomepage() {
  
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  // Sample testimonials data
  const testimonials = [
    {
      quote: "After my unexpected pregnancy, I felt completely lost. My therapist through MindfulMoms helped me find my footing again.",
      author: "Sarah, 28",
      role: "First-time mom"
    },
    {
      quote: "The subsidized sessions made professional help accessible when I needed it most during my postpartum journey.",
      author: "Jamila, 32",
      role: "Working mother"
    },
    {
      quote: "Finding a therapist who specializes in pregnancy anxiety changed everything for me. I'm now able to enjoy this special time.",
      author: "Emily, 25",
      role: "Expecting twins"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (

    <SideBar>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        {/* Emergency Contacts Modal */}
        {emergencyModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-red-600">Emergency Support</h3>
                <button 
                  onClick={() => setEmergencyModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-700">National Suicide Prevention Lifeline</h4>
                  <p className="text-gray-700">Call: 988</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-700">Postpartum Support International</h4>
                  <p className="text-gray-700">Call: 1-800-944-4773</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-700">Crisis Text Line</h4>
                  <p className="text-gray-700">Text HOME to 741741</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                If this is a medical emergency, please call 911 or go to your nearest emergency room.
              </p>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-12">
          {/* Hero Section */}
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
              Welcome to <span className="text-indigo-600">MindfulMoms</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Compassionate mental health support tailored for expectant and new mothers
            </p>
            
            {/* Animated pregnancy stage selector */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="bg-white p-4 rounded-lg shadow-md inline-block">
                <p className="text-sm text-gray-600 mb-2">I'm looking for support during:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Pregnancy', 'Postpartum', 'Trying to Conceive', 'Pregnancy Loss'].map((stage) => (
                    <button
                      key={stage}
                      className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm hover:bg-indigo-200 transition-colors"
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </header>

          {/* Action Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-indigo-50">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-3 text-indigo-800">Find Your Therapist</h2>
              <p className="mb-4 text-gray-600">Connect with verified professionals specializing in maternal mental health</p>
              <Link 
                to="/therapists" 
                className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Search Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-red-50">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-3 text-red-800">Urgent Support</h2>
              <p className="mb-4 text-gray-600">Immediate help is available if you're in emotional distress</p>
              <button 
                onClick={() => setEmergencyModalOpen(true)}
                className="inline-flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                Emergency Contacts
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-green-50">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-3 text-green-800">Wellness Resources</h2>
              <p className="mb-4 text-gray-600">Articles, tools and self-guided exercises for your journey</p>
              <button className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                Browse Resources
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Testimonials Carousel */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center text-indigo-900">Real Stories, Real Support</h2>
            <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto">
              <div className="relative min-h-[180px]">
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={index}
                    className={`transition-opacity duration-500 ${index === activeTestimonial ? 'opacity-100' : 'opacity-0 absolute top-0'}`}
                  >
                    <blockquote className="italic text-gray-700 text-lg mb-4">
                      "{testimonial.quote}"
                    </blockquote>
                    <div className="text-right">
                      <p className="font-medium text-indigo-800">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full ${index === activeTestimonial ? 'bg-indigo-600' : 'bg-gray-300'}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-indigo-800 text-white rounded-xl p-8 mb-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold mb-2">98%</p>
                <p className="text-indigo-200">Satisfaction Rate</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">500+</p>
                <p className="text-indigo-200">Mothers Supported</p>
              </div>
              <div>
                <p className="text-4xl font-bold mb-2">24/7</p>
                <p className="text-indigo-200">Crisis Support</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-indigo-900">Ready to Begin Your Healing Journey?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Take the first step toward emotional well-being. Our therapists are here to support you.
            </p>
            <Link 
              to="/therapists" 
              className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Find Your Therapist Today
            </Link>
          </section>
        </div>
      </div>
    </SideBar>
  );
}