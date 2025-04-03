import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

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

// Therapist Pages
import TherapistHomepage from './components/pages/therapists/TherapistHomepage';
import TherapistProfileManagement from './components/pages/therapists/TherapistProfileManagement';
import TherapistAppointments from './components/pages/therapists/TherapistAppointments';
import TherapistMessages from './components/pages/therapists/TherapistMessages';
import TherapistEarnings from './components/pages/therapists/TherapistEarnings';
import TherapistSettings from './components/pages/therapists/TherapistSettings';
import TherapistFeedback from './components/pages/therapists/TherapistFeedback';

const user = { role: 'therapist' };

function App() {
  return (
    <Router>
        <Routes>
        {user.role === 'patient' && (
          <>
            <Route path="/therapists" element={<TherapistSearch />} />
            <Route path="/therapist/:id" element={<TherapistProfile />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/confirmation" element={<ConfirmationPage />} />
            <Route path="/" element={<PatientDashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/payment-history" element={<PaymentHistory />} />
            <Route path="/settings" element={<PatientSettings />} />    
          </>
        )};

        {/* Therapist Routes */}
        {user.role === 'therapist' && (
          <>
            <Route path="/" element={<TherapistHomepage />} />
            <Route path="/profile" element={<TherapistProfileManagement />} />
            <Route path="/appointments" element={<TherapistAppointments />} />
            <Route path="/messages" element={<TherapistMessages />} />
            <Route path="/earnings" element={<TherapistEarnings />} />
            <Route path="/settings" element={<TherapistSettings />} />
            <Route path="/feedback" element={<TherapistFeedback />} />
          </>
        )}

        </Routes>
    </Router>
  );
}

export default App;
