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

const user = { role: 'patient' };

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
            <Route path="/emergency" element={<PatientEmergency />} />    
            <Route path="/education" element={<PatientEducation />} />    
            <Route path="/payment-methods" element={<PatientPaymentMethods />} />    
            <Route path="/progress" element={<PatientProgressTracker />} />    
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
            <Route path="/Session-notes" element={<TherapistSessionNotes />} />
            <Route path="/clients" element={<TherapistClientManagement />} />
            <Route path="/resources" element={<TherapistResources />} />
            <Route path="/availability" element={<TherapistAvailability />} />

          </>
        )}

        </Routes>
    </Router>
  );
}

export default App;
