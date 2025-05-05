import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

import PageLayout from './components/pages/common/PageLayout'

// Patient Pages
import PatientHomepage from './components/pages/patients/PatientHomepage';
import TherapistSearch from './components/pages/patients/TherapistSearch';
import TherapistProfile from './components/pages/patients/TherapistProfile';
import BookingPage from './components/pages/patients/BookingPage';
import ConfirmationPage from './components/pages/patients/ConfirmationPage';
import PatientDashboard from './components/pages/patients/PatientDashboard';
import Appointments from './components/pages/patients/Appointments';
import Messages from './components/pages/patients/Messages';
import Feedback from './components/pages/patients/Feedback';
import PaymentHistory from './components/pages/patients/PaymentHistory';
import PatientSettings from './components/pages/patients/PatientSettings';
import PatientEmergency from './components/pages/patients/PatientEmergency';
import PatientProgressTracker from './components/pages/patients/PatientProgressTracker';
import PatientPaymentMethods from './components/pages/patients/PatientPaymentMethods';
import PatientEducation from './components/pages/patients/PatientEducation';


// Therapist Pages
import TherapistHomepage from './components/pages/therapists/TherapistHomepage';
import TherapistProfileManagement from './components/pages/therapists/TherapistProfileManagement';
import TherapistAppointments from './components/pages/therapists/TherapistAppointments';
import TherapistMessages from './components/pages/therapists/TherapistMessages';
import TherapistEarnings from './components/pages/therapists/TherapistEarnings';
import TherapistSettings from './components/pages/therapists/TherapistSettings';
import TherapistFeedback from './components/pages/therapists/TherapistFeedback';
import TherapistAvailability from './components/pages/therapists/TherapistAvailability';
import TherapistClientManagement from './components/pages/therapists/TherapistClientManagement';
import TherapistResources from './components/pages/therapists/TherapistResources';
import TherapistSessionNotes from './components/pages/therapists/TherapistSessionNotes';

{/*ALTER HERE*/}

// const user = { role: 'patient' };

function App() {
  const [auth, setAuth] = useState({
    role: null,
    isLoading: true,
    isAuthenticated: false
  });

  // Consolidated auth check function
  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:3500/user', {
        credentials: 'include' // Important!
      });
      
      if (response.ok) {
        const data = await response.json();
        setAuth({
          role: data.user.role,
          isLoading: false,
          isAuthenticated: true
        });
      } else {
        setAuth({
          role: null,
          isLoading: false,
          isAuthenticated: false
        });
      }
    } catch (error) {
      setAuth({
        role: null,
        isLoading: false,
        isAuthenticated: false
      });
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

return (
    <Router>
        <Routes>

        {/* Public route */}
        <Route path="/login" element={ !auth.isAuthenticated ? <PageLayout /> : <Navigate to="/" />} />
        <Route path="/register" element={ <PageLayout /> } />

        {/* Patient routes */}
        
          <>
          mm<Route path="/patient" element={<PatientDashboard />} />
            <Route path="/therapists" element={<TherapistSearch/>} />
            <Route path="/therapist/:id" element={<TherapistProfile />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/p-appointments" element={<Appointments />} />
            <Route path="/p-messages" element={<Messages />} />
            <Route path="/p-feedback" element={<Feedback />} />
            <Route path="/payment-history" element={<PaymentHistory />} />
            <Route path="/p-settings" element={<PatientSettings />} />  
            <Route path="/emergency" element={<PatientEmergency />} />    
            <Route path="/education" element={<PatientEducation />} />    
            <Route path="/payment-methods" element={<PatientPaymentMethods />} />    
            <Route path="/progress" element={<PatientProgressTracker />} />    
          </>
        

        {/* Therapist Routes */}
        {/* {userRole === 'therapist' && ( */}
          <>
            <Route path="/therapist" element={<TherapistHomepage />} />
            <Route path="/profile" element={<TherapistProfileManagement />} />
            <Route path="/t-appointments" element={<TherapistAppointments />} />
            <Route path="/t-messages" element={<TherapistMessages />} />
            <Route path="/earnings" element={<TherapistEarnings />} />
            <Route path="/t-settings" element={<TherapistSettings />} />
            <Route path="/t-feedback" element={<TherapistFeedback />} />
            <Route path="/Session-notes" element={<TherapistSessionNotes />} />
            <Route path="/clients" element={<TherapistClientManagement />} />
            <Route path="/resources" element={<TherapistResources />} />
            <Route path="/availability" element={<TherapistAvailability />} />

          </>
        {/* )} */}

        {/* Root redirect based on role */}
        <Route path="/" element={
          auth.isAuthenticated ? (
            auth.role === 'patient' ? <PatientDashboard /> : 
            auth.role === 'therapist' ? <TherapistHomepage /> : 
            <Navigate to="/login" />
          ) : <Navigate to="/login" />
        } />
        
        {/* Catch-all for unauthorized */}
        <Route path="*" element={<Navigate to={auth.isAuthenticated ? "/" : "/login"} />} />

        </Routes>
    </Router>
  );
}

export default App;
