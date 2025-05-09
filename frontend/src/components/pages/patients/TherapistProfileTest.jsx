import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SideBar from '../../PatientSideBar';

const TherapistProfileTest = () => {
  const { id } = useParams();
  const [therapist, setTherapist] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);

  // Add a log message
  const addLog = (message, type = 'info') => {
    setLogs(prev => [...prev, { message, type, timestamp: new Date().toISOString() }]);
    console.log(`[${type.toUpperCase()}] ${message}`);
  };

  // Fetch therapist data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      addLog(`Starting to fetch data for therapist ID: ${id}`);

      // Fallback data
      const fallbackTherapist = {
        id: id,
        name: "Dr. John Doe",
        specialization: "Cognitive Behavioral Therapy",
        bio: "Experienced therapist specializing in anxiety and depression.",
        years_of_experience: 5,
        hourly_rate: 100,
        rating: 4.8,
        reviews_count: 24,
        profile_picture_url: "https://randomuser.me/api/portraits/men/32.jpg"
      };

      const fallbackAvailability = [
        { day_of_week: 'monday', start_time: '09:00:00', end_time: '17:00:00' },
        { day_of_week: 'wednesday', start_time: '10:00:00', end_time: '18:00:00' },
        { day_of_week: 'friday', start_time: '08:00:00', end_time: '16:00:00' }
      ];

      try {
        // 1. Try to fetch therapist profile
        addLog(`Fetching therapist profile from /api/therapists/${id}/profile`);
        let profileData = fallbackTherapist;

        try {
          // Try the main endpoint first
          let profileResponse = await fetch(`/api/therapists/${id}/profile`);
          addLog(`Profile response status: ${profileResponse.status}`);

          // If the main endpoint fails, try the test endpoint
          if (!profileResponse.ok) {
            addLog('Main profile endpoint failed, trying test endpoint');
            profileResponse = await fetch(`/api/test/therapist/${id}/profile`);
            addLog(`Test profile response status: ${profileResponse.status}`);
          }

          if (profileResponse.ok) {
            const contentType = profileResponse.headers.get('content-type');
            addLog(`Profile response content type: ${contentType}`);

            if (contentType && contentType.includes('application/json')) {
              const data = await profileResponse.json();
              addLog('Successfully parsed profile JSON data');
              profileData = data;
            } else {
              addLog('Profile response is not JSON, using fallback data', 'warn');
            }
          } else {
            addLog(`All profile requests failed, using fallback data`, 'warn');
          }
        } catch (profileError) {
          addLog(`Error fetching profile: ${profileError.message}`, 'error');
        }

        // 2. Try to fetch availability
        addLog(`Fetching availability from /api/therapists/${id}/availability`);
        let availabilityData = fallbackAvailability;

        try {
          const availabilityResponse = await fetch(`/api/therapists/${id}/availability`);
          addLog(`Availability response status: ${availabilityResponse.status}`);

          if (availabilityResponse.ok) {
            const contentType = availabilityResponse.headers.get('content-type');
            addLog(`Availability response content type: ${contentType}`);

            if (contentType && contentType.includes('application/json')) {
              const data = await availabilityResponse.json();
              addLog('Successfully parsed availability JSON data');
              availabilityData = data;
            } else {
              addLog('Availability response is not JSON, using fallback data', 'warn');
            }
          } else {
            addLog(`Availability request failed with status ${availabilityResponse.status}, using fallback data`, 'warn');
          }
        } catch (availabilityError) {
          addLog(`Error fetching availability: ${availabilityError.message}`, 'error');
        }

        // 3. Try the test endpoint as a last resort
        if (availabilityData === fallbackAvailability) {
          addLog('Trying test endpoint as fallback');
          try {
            const testResponse = await fetch(`/api/test/availability/${id}`);
            addLog(`Test endpoint response status: ${testResponse.status}`);

            if (testResponse.ok) {
              const contentType = testResponse.headers.get('content-type');
              addLog(`Test endpoint response content type: ${contentType}`);

              if (contentType && contentType.includes('application/json')) {
                const data = await testResponse.json();
                addLog('Successfully parsed test endpoint JSON data');
                availabilityData = data;
              }
            }
          } catch (testError) {
            addLog(`Error fetching from test endpoint: ${testError.message}`, 'error');
          }
        }

        // Set the data
        setTherapist(profileData);
        setAvailability(availabilityData);
        setError(null);
        addLog('Data fetching completed successfully');
      } catch (error) {
        addLog(`Unexpected error: ${error.message}`, 'error');
        setError('An unexpected error occurred. Please try again later.');

        // Still set fallback data
        setTherapist(fallbackTherapist);
        setAvailability(fallbackAvailability);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';

    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (err) {
      console.error('Error formatting time:', err);
      return timeString;
    }
  };

  return (
    <SideBar>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Therapist Profile Test Page</h1>

        {/* Debug Information */}
        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Debug Information</h2>
          <p><strong>Therapist ID:</strong> {id}</p>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error || 'None'}</p>
        </div>

        {/* Logs */}
        <div className="bg-black text-white p-4 rounded-lg mb-6 overflow-auto max-h-60">
          <h2 className="text-lg font-semibold mb-2">Logs</h2>
          {logs.map((log, index) => (
            <div
              key={index}
              className={`mb-1 ${
                log.type === 'error' ? 'text-red-400' :
                log.type === 'warn' ? 'text-yellow-400' : 'text-green-400'
              }`}
            >
              [{new Date(log.timestamp).toLocaleTimeString()}] {log.message}
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Therapist Information */}
            {therapist && (
              <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Therapist Information</h2>
                <div className="flex items-center mb-4">
                  <img
                    src={therapist.profile_picture_url || "https://randomuser.me/api/portraits/men/32.jpg"}
                    alt={therapist.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-medium">{therapist.name}</h3>
                    <p className="text-gray-600">{therapist.specialization}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Bio:</strong> {therapist.bio}</p>
                    <p><strong>Experience:</strong> {therapist.years_of_experience} years</p>
                  </div>
                  <div>
                    <p><strong>Hourly Rate:</strong> ${therapist.hourly_rate}</p>
                    <p><strong>Rating:</strong> {therapist.rating} ({therapist.reviews_count} reviews)</p>
                  </div>
                </div>
                <pre className="mt-4 bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(therapist, null, 2)}
                </pre>
              </div>
            )}

            {/* Availability Information */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Availability</h2>
              {availability.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 text-left">Day</th>
                        <th className="py-2 px-4 text-left">Start Time</th>
                        <th className="py-2 px-4 text-left">End Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {availability.map((slot, index) => (
                        <tr key={index} className="border-t">
                          <td className="py-2 px-4 capitalize">{slot.day_of_week}</td>
                          <td className="py-2 px-4">{formatTime(slot.start_time)}</td>
                          <td className="py-2 px-4">{formatTime(slot.end_time)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No availability slots found.</p>
              )}
              <pre className="mt-4 bg-gray-100 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(availability, null, 2)}
              </pre>
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="mt-6">
          <Link
            to="/therapists"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Back to Therapists
          </Link>
        </div>
      </div>
    </SideBar>
  );
};

export default TherapistProfileTest;
