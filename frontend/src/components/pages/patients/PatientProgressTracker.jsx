import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import SideBar from '../../PatientSideBar';
import { TrendingUp, Users, Calendar, Award } from 'lucide-react';
import { MdOutlineEmojiPeople, MdOutlineShowChart } from 'react-icons/md';

// Register ChartJS components
ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale, 
  LinearScale, BarElement, PointElement, LineElement
);

const TherapistProgressPage = () => {
  const [timeRange, setTimeRange] = useState('monthly');
  const [activeTab, setActiveTab] = useState('overview');

  // Sample data - replace with your actual data
  const patients = [
    { id: 1, name: 'Sarah Johnson', progress: 75, sessions: 12, lastSession: '2 days ago' },
    { id: 2, name: 'Michael Chen', progress: 52, sessions: 8, lastSession: '1 week ago' },
    { id: 3, name: 'Emma Williams', progress: 89, sessions: 15, lastSession: '3 days ago' },
    { id: 4, name: 'David Kim', progress: 34, sessions: 5, lastSession: '2 weeks ago' },
  ];

  // Chart data configurations
  const progressData = {
    labels: patients.map(patient => patient.name),
    datasets: [{
      label: 'Progress %',
      data: patients.map(patient => patient.progress),
      backgroundColor: [
        'rgba(74, 222, 128, 0.7)',
        'rgba(96, 165, 250, 0.7)',
        'rgba(250, 204, 21, 0.7)',
        'rgba(249, 115, 22, 0.7)',
      ],
      borderColor: [
        'rgba(74, 222, 128, 1)',
        'rgba(96, 165, 250, 1)',
        'rgba(250, 204, 21, 1)',
        'rgba(249, 115, 22, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const sessionData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Sessions Completed',
      data: [12, 19, 15, 22, 18, 25],
      backgroundColor: 'rgba(167, 139, 250, 0.7)',
      borderColor: 'rgba(167, 139, 250, 1)',
      borderWidth: 2,
      tension: 0.3,
    }],
  };

  const progressTrendData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: patients.map((patient, idx) => ({
      label: patient.name,
      data: [
        Math.round(patient.progress * 0.3),
        Math.round(patient.progress * 0.5),
        Math.round(patient.progress * 0.7),
        patient.progress
      ],
      borderColor: [
        'rgba(74, 222, 128, 1)',
        'rgba(96, 165, 250, 1)',
        'rgba(250, 204, 21, 1)',
        'rgba(249, 115, 22, 1)',
      ][idx],
      backgroundColor: 'transparent',
      borderWidth: 2,
    })),
  };

  return (
    <SideBar>
      <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Patient Progress Dashboard</h1>
            <p className="text-gray-600">Track and analyze your patients' therapeutic journey</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <button
              onClick={() => setTimeRange('weekly')}
              className={`px-4 py-2 rounded-lg ${timeRange === 'weekly' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeRange('monthly')}
              className={`px-4 py-2 rounded-lg ${timeRange === 'monthly' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeRange('yearly')}
              className={`px-4 py-2 rounded-lg ${timeRange === 'yearly' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700'}`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Active Patients</p>
                <h3 className="text-2xl font-bold mt-1">24</h3>
              </div>
              <Users className="text-3xl text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Avg. Progress</p>
                <h3 className="text-2xl font-bold mt-1">68%</h3>
              </div>
              <TrendingUp className="text-3xl text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Sessions This Month</p>
                <h3 className="text-2xl font-bold mt-1">42</h3>
              </div>
              <Calendar className="text-3xl text-yellow-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500">Success Rate</p>
                <h3 className="text-2xl font-bold mt-1">89%</h3>
              </div>
              <Award className="text-3xl text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className={`px-4 py-2 font-medium ${activeTab === 'patients' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
          >
            Patient Details
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-medium ${activeTab === 'analytics' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
          >
            Advanced Analytics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MdOutlineEmojiPeople className="text-purple-500" />
                  Patient Progress Distribution
                </h3>
                <div className="h-80">
                  <Pie data={progressData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MdOutlineShowChart className="text-blue-500" />
                  Session Trends ({timeRange})
                </h3>
                <div className="h-80">
                  <Bar data={sessionData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Progress Over Time</h3>
              <div className="h-96">
                <Line data={progressTrendData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sessions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Session</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patients.map((patient) => (
                    <tr key={patient.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-medium">
                            {patient.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div 
                              className={`h-2.5 rounded-full ${patient.progress > 70 ? 'bg-green-500' : patient.progress > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                              style={{ width: `${patient.progress}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm text-gray-500">{patient.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.sessions}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.lastSession}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-purple-600 hover:text-purple-900 mr-3">View</button>
                        <button className="text-blue-600 hover:text-blue-900">Message</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Advanced Analytics Coming Soon</h3>
            <p className="text-gray-600">We're working on more detailed analytics features to help you better understand patient progress patterns.</p>
          </div>
        )}
      </div>
    </SideBar>
  );
};

export default TherapistProgressPage;