import React from 'react';
import SideBar from '../../TherapistSideBar';
import { FiCalendar, FiUsers, FiClock, FiDollarSign, FiMessageSquare, FiPieChart, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const TherapistHomepage = () => {
  // Enhanced sample data
  const stats = {
    totalClients: 42,
    newClients: 5,
    pendingSessions: 3,
    completedSessions: 127,
    monthlyRevenue: 8725,
    satisfactionRate: 96,
    avgSessionDuration: '48 min'
  };

  const upcomingAppointments = [
    { id: 1, client: 'Sarah Johnson', time: '10:00 AM', type: 'Video', duration: '50 min', status: 'confirmed', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 2, client: 'Michael Chen', time: '2:30 PM', type: 'In-person', duration: '50 min', status: 'confirmed', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 3, client: 'Emma Williams', time: '4:00 PM', type: 'Phone', duration: '30 min', status: 'pending', avatar: 'https://randomuser.me/api/portraits/women/65.jpg' }
  ];

  const recentClients = [
    { id: 1, name: 'Jessica Taylor', lastSession: '2 days ago', progress: 75, avatar: 'https://randomuser.me/api/portraits/women/43.jpg' },
    { id: 2, name: 'David Miller', lastSession: '1 week ago', progress: 60, avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
    { id: 3, name: 'Olivia Davis', lastSession: '3 days ago', progress: 85, avatar: 'https://randomuser.me/api/portraits/women/28.jpg' }
  ];

  const sessionData = [
    { name: 'Mon', sessions: 5 },
    { name: 'Tue', sessions: 7 },
    { name: 'Wed', sessions: 4 },
    { name: 'Thu', sessions: 6 },
    { name: 'Fri', sessions: 3 },
    { name: 'Sat', sessions: 1 },
    { name: 'Sun', sessions: 0 }
  ];

  const sessionTypesData = [
    { name: 'Video', value: 65 },
    { name: 'In-person', value: 25 },
    { name: 'Phone', value: 10 }
  ];

  const COLORS = ['#6366F1', '#8B5CF6', '#A5B4FC'];

  return (
    <SideBar>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        {/* Animated Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-indigo-900">Welcome Back, Dr. Smith</h1>
            <p className="text-indigo-600">Here's what's happening with your practice today</p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search clients, sessions..."
              className="pl-10 pr-4 py-2 rounded-full border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards with Pulse Animation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              icon: <FiUsers size={24} />, 
              title: "Total Clients", 
              value: stats.totalClients, 
              color: "blue",
              trend: "↑ 12%"
            },
            { 
              icon: <FiCalendar size={24} />, 
              title: "Pending Sessions", 
              value: stats.pendingSessions, 
              color: "purple",
              trend: "↑ 2 today"
            },
            { 
              icon: <FiDollarSign size={24} />, 
              title: "Monthly Revenue", 
              value: `$${stats.monthlyRevenue.toLocaleString()}`, 
              color: "green",
              trend: "↑ 8%"
            },
            { 
              icon: <FiPieChart size={24} />, 
              title: "Satisfaction Rate", 
              value: `${stats.satisfactionRate}%`, 
              color: "yellow",
              trend: "↑ 3%"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-lg p-6 border-l-4 border-${stat.color}-500 relative overflow-hidden`}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600 mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-500 text-sm">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                </div>
              </div>
              <span className={`absolute top-3 right-4 text-xs font-medium bg-${stat.color}-100 text-${stat.color}-800 px-2 py-1 rounded-full`}>
                {stat.trend}
              </span>
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className={`absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-${stat.color}-100 opacity-20`}
              />
            </motion.div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Appointments with Avatars */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center">
                  <FiClock className="mr-2" /> Today's Schedule
                </h2>
                <span className="text-indigo-200">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
            <div className="p-4">
              {upcomingAppointments.map((appointment) => (
                <motion.div
                  key={appointment.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-3 mb-2 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 last:mb-0"
                >
                  <div className="flex items-center">
                    <img src={appointment.avatar} alt={appointment.client} className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800">{appointment.client}</h4>
                      <p className="text-sm text-gray-600 flex items-center">
                        <FiClock className="mr-1" size={12} />
                        {appointment.time} • {appointment.type} ({appointment.duration})
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status}
                  </span>
                </motion.div>
              ))}
              <button className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all flex items-center justify-center">
                View Full Calendar
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Client Progress with Enhanced Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
              <h2 className="text-xl font-semibold flex items-center">
                <FiActivity className="mr-2" /> Client Progress
              </h2>
            </div>
            <div className="p-4">
              {recentClients.map((client) => (
                <motion.div 
                  key={client.id} 
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center p-3 mb-3 bg-white rounded-lg shadow-sm border border-gray-100 last:mb-0"
                >
                  <img src={client.avatar} alt={client.name} className="w-12 h-12 rounded-full mr-3 border-2 border-blue-200" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-gray-800">{client.name}</h4>
                      <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {client.progress}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">Last session: {client.lastSession}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full" 
                        style={{ width: `${client.progress}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
              <button className="w-full mt-4 py-2.5 bg-white border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium rounded-lg transition-all flex items-center justify-center">
                View All Clients
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Session Analytics - Dual Charts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FiPieChart className="mr-2 text-indigo-600" /> Session Analytics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Weekly Sessions</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sessionData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                      <XAxis dataKey="name" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        contentStyle={{
                          background: 'white',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          border: 'none'
                        }}
                      />
                      <Bar 
                        dataKey="sessions" 
                        radius={[4, 4, 0, 0]}
                        gradientTransform="rotate(90)"
                      >
                        {sessionData.map((entry, index) => (
                          <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                          </linearGradient>
                        ))}
                        <Bar dataKey="sessions" fill="url(#colorBar)" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Session Types</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sessionTypesData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {sessionTypesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          background: 'white',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                          border: 'none'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center mt-4 space-x-4">
                    {sessionTypesData.map((entry, index) => (
                      <div key={index} className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-1" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm text-gray-600">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Quick Actions with Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="lg:col-span-3 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white"
          >
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex flex-col items-center justify-center p-4 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all">
                <FiMessageSquare size={24} className="mb-2" />
                <span>New Message</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all">
                <FiCalendar size={24} className="mb-2" />
                <span>Schedule</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all">
                <FiUsers size={24} className="mb-2" />
                <span>Add Client</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-white bg-opacity-10 rounded-lg hover:bg-opacity-20 transition-all">
                <FiDollarSign size={24} className="mb-2" />
                <span>Billing</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </SideBar>
  );
};

export default TherapistHomepage;