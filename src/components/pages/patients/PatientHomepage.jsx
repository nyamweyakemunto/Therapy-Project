import React from 'react'
import SideBar from '../../PatientSideBar';


import { Link } from 'react-router-dom';

export default function PatientHomepage() {
  return (

    <SideBar>
          <div className="mx-auto px-4 py-8 bg">
      <header className="text-center mb-12">
        <h1 className="text-3xl font-bold text-indigo-800 mb-4">Welcome to MindfulMoms</h1>
        <p className="text-lg text-gray-600">
          Connecting expectant and new mothers with verified mental health professionals
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-indigo-700">Find Your Therapist</h2>
          <p className="mb-4 text-gray-600">Browse our network of licensed professionals specializing in perinatal care</p>
          <Link to="/therapists" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Search Now
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-indigo-700">Urgent Support</h2>
          <p className="mb-4 text-gray-600">Immediate help is available if you're in crisis</p>
          <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
            Emergency Contacts
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3 text-indigo-700">Resources</h2>
          <p className="mb-4 text-gray-600">Articles and tools for your mental wellness journey</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Browse Resources
          </button>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">Success Stories</h2>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <blockquote className="italic text-gray-700 mb-4">
            "After my unexpected pregnancy, I felt completely lost. My therapist through MindfulMoms helped me find my footing again."
          </blockquote>
          <p className="text-right font-medium">- Sarah, 28</p>
        </div>
      </section>
    </div>
    </SideBar>
  );
}