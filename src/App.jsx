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


function App() {
  return (
    <Router>
        <Routes>
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
        </Routes>
    </Router>
  );
}

export default App;
