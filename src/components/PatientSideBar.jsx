import { Link } from 'react-router-dom'; // Import Link for navigation

const SideBar = ({children}) => {
  return (
    <div className="flex flex-row w-full h-full">
      {/* Sidebar Navigation */}
      <nav className="flex flex-col gap-4 justify-start fixed h-full p-8 w-64 min-h-screen py-3 bg-[rgb(54,116,181)] text-white no-underline overflow-y-auto">
      <h1 className='text-xl font-bold text-black'>PATIENT THERAPY</h1>
      <Link to="/" className="py-2 px-3 text-white hover:bg-blue-700  rounded transition">
          Patient Dashboard
        </Link>
        <Link to="/therapists" className="py-2 px-3 hover:bg-blue-700 rounded transition">
          Therapist Search
        </Link>
        <Link to="/booking" className="py-2 px-3 hover:bg-blue-700 rounded transition">
          Booking Page
        </Link>
        <Link to="/confirmation" className="py-2 px-3 hover:bg-blue-700 rounded transition">
          Confirmation Page
        </Link>
        <Link to="/appointments" className="py-2 px-3 hover:bg-blue-700 rounded transition">
          Appointments
        </Link>
        <Link to="/messages" className="py-2 px-3 hover:bg-blue-700 rounded transition">
          Messages
        </Link>
        <Link to="/feedback" className="py-2 px-3 hover:bg-blue-700 rounded transition">
          Feedback
        </Link>
        <Link to="/education" className="py-2 px-3 hover:bg-blue-700 rounded transition">
          Education Resources
        </Link>
        <Link to="/progress" className="py-2 px-3 hover:bg-blue-700 rounded transition">
          Progress Tracker
        </Link>
        <Link to="/payment-methods" className="py-2 px-3 hover:bg-blue-700 rounded transition">
          Payment Methods
        </Link>
        <Link to="/emergency" className="py-2 px-3 hover:bg-blue-700 rounded transition">
          Emergency Response
        </Link>
        <Link to="/payment-history" className="py-2 px-3 hover:bg-blue-700 rounded transition">
          Payment history
        </Link>
        <Link to="/settings" className="py-2 px-3 hover:bg-blue-700 rounded transition">
          Settings
        </Link>
      </nav>

      {/* Main Content Area */}
      <section className="ml-60 flex-1 p-5">
        {/* Your page content will go here */}
        {children}
      </section>
    </div>
  );
};

export default SideBar