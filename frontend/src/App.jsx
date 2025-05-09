import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

import PageLayout from './components/pages/common/PageLayout'

// Patient Pages
import PatientHomepage from './components/pages/patients/PatientHomepage';
import TherapistSearch from './components/pages/patients/TherapistSearch';
import TherapistProfile from './components/pages/patients/TherapistProfile';
import TherapistProfileTest from './components/pages/patients/TherapistProfileTest';
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
  const { user, loading } = useContext(AuthContext);

  // Create a protected route component
  const ProtectedRoute = ({ element, requiredRole }) => {
    // If still loading, show loading indicator
    if (loading) {
      return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    // If not authenticated, redirect to login
    if (!user) {
      return <Navigate to="/login" />;
    }

    // If role is required and user doesn't have it, redirect to appropriate dashboard
    if (requiredRole && user.role !== requiredRole) {
      return <Navigate to="/" />;
    }

    // Otherwise, render the protected component
    return element;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!user ? <PageLayout /> : <Navigate to="/" />} />
        <Route path="/register" element={<PageLayout />} />

        {/* Patient routes */}
        <Route path="/patient" element={<ProtectedRoute element={<PatientDashboard />} requiredRole="patient" />} />
        <Route path="/therapists" element={<ProtectedRoute element={<TherapistSearch />} requiredRole="patient" />} />
        <Route path="/therapist/:id" element={<ProtectedRoute element={<TherapistProfile />} requiredRole="patient" />} />
        <Route path="/therapist-test/:id" element={<TherapistProfileTest />} />
        <Route path="/confirmation" element={<ProtectedRoute element={<ConfirmationPage />} requiredRole="patient" />} />
        <Route path="/p-appointments" element={<ProtectedRoute element={<Appointments />} requiredRole="patient" />} />
        <Route path="/p-messages" element={<ProtectedRoute element={<Messages />} requiredRole="patient" />} />
        <Route path="/p-feedback" element={<ProtectedRoute element={<Feedback />} requiredRole="patient" />} />
        <Route path="/payment-history" element={<ProtectedRoute element={<PaymentHistory />} requiredRole="patient" />} />
        <Route path="/p-settings" element={<ProtectedRoute element={<PatientSettings />} requiredRole="patient" />} />
        <Route path="/emergency" element={<ProtectedRoute element={<PatientEmergency />} requiredRole="patient" />} />
        <Route path="/education" element={<ProtectedRoute element={<PatientEducation />} requiredRole="patient" />} />
        <Route path="/payment-methods" element={<ProtectedRoute element={<PatientPaymentMethods />} requiredRole="patient" />} />
        <Route path="/progress" element={<ProtectedRoute element={<PatientProgressTracker />} requiredRole="patient" />} />

        {/* Therapist Routes */}
        <Route path="/therapist" element={<ProtectedRoute element={<TherapistHomepage />} requiredRole="therapist" />} />
        <Route path="/profile" element={<ProtectedRoute element={<TherapistProfileManagement />} requiredRole="therapist" />} />
        <Route path="/t-appointments" element={<ProtectedRoute element={<TherapistAppointments />} requiredRole="therapist" />} />
        <Route path="/t-messages" element={<ProtectedRoute element={<TherapistMessages />} requiredRole="therapist" />} />
        <Route path="/earnings" element={<ProtectedRoute element={<TherapistEarnings />} requiredRole="therapist" />} />
        <Route path="/t-settings" element={<ProtectedRoute element={<TherapistSettings />} requiredRole="therapist" />} />
        <Route path="/t-feedback" element={<ProtectedRoute element={<TherapistFeedback />} requiredRole="therapist" />} />
        <Route path="/session-notes" element={<ProtectedRoute element={<TherapistSessionNotes />} requiredRole="therapist" />} />
        <Route path="/clients" element={<ProtectedRoute element={<TherapistClientManagement />} requiredRole="therapist" />} />
        <Route path="/resources" element={<ProtectedRoute element={<TherapistResources />} requiredRole="therapist" />} />
        <Route path="/availability" element={<ProtectedRoute element={<TherapistAvailability />} requiredRole="therapist" />} />

        {/* Root redirect based on role */}
        <Route path="/" element={
          user ? (
            user.role === 'patient' ? <PatientDashboard /> :
            user.role === 'therapist' ? <TherapistHomepage /> :
            <Navigate to="/login" />
          ) : <Navigate to="/login" />
        } />

        {/* Catch-all for unauthorized */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
