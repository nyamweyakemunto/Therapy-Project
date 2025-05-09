import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const SideBar = ({children}) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Auto-close sidebar on small screens, auto-open on larger screens
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    // Initial check
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex flex-row w-full h-full relative">
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-[rgb(54,116,181)] text-white md:hidden hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 transition-colors duration-200"
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && windowWidth < 768 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <nav
        className={`flex flex-col gap-4 justify-between fixed h-full z-40 min-h-screen py-3 bg-[rgb(54,116,181)] text-white no-underline overflow-y-auto transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'left-0' : '-left-64'}
          md:left-0
          w-64 md:w-60 lg:w-64
          md:p-8 p-6
          ${windowWidth < 768 ? 'pt-16' : ''}
        `}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex flex-col gap-4 md:gap-3 lg:gap-4 pb-24 md:pb-16">
          <h1 className='text-xl md:text-lg lg:text-xl font-bold text-black'>THERAPIST PORTAL</h1>
          <Link to="/" className="py-2 px-3 md:py-1.5 md:px-2 lg:py-2 lg:px-3 text-white hover:bg-blue-700 rounded transition duration-200 text-base md:text-sm lg:text-base">
            Therapist Dashboard
          </Link>
          <Link to="/t-appointments" className="py-2 px-3 md:py-1.5 md:px-2 lg:py-2 lg:px-3 text-white hover:bg-blue-700 rounded transition duration-200 text-base md:text-sm lg:text-base">
            Appointments
          </Link>
          <Link to="/availability" className="py-2 px-3 md:py-1.5 md:px-2 lg:py-2 lg:px-3 text-white hover:bg-blue-700 rounded transition duration-200 text-base md:text-sm lg:text-base">
            Availability
          </Link>
          <Link to="/clients" className="py-2 px-3 md:py-1.5 md:px-2 lg:py-2 lg:px-3 text-white hover:bg-blue-700 rounded transition duration-200 text-base md:text-sm lg:text-base">
            Client Management
          </Link>
          <Link to="/t-messages" className="py-2 px-3 md:py-1.5 md:px-2 lg:py-2 lg:px-3 text-white hover:bg-blue-700 rounded transition duration-200 text-base md:text-sm lg:text-base">
            Messages
          </Link>
          <Link to ="/session-notes" className="py-2 px-3 md:py-1.5 md:px-2 lg:py-2 lg:px-3 text-white hover:bg-blue-700 rounded transition duration-200 text-base md:text-sm lg:text-base">
            Session Notes
          </Link>
          <Link to="/earnings" className="py-2 px-3 md:py-1.5 md:px-2 lg:py-2 lg:px-3 text-white hover:bg-blue-700 rounded transition duration-200 text-base md:text-sm lg:text-base">
            Earnings
          </Link>
          <Link to="/resources" className="py-2 px-3 md:py-1.5 md:px-2 lg:py-2 lg:px-3 text-white hover:bg-blue-700 rounded transition duration-200 text-base md:text-sm lg:text-base">
            Education Resources
          </Link>
          <Link to="/profile" className="py-2 px-3 md:py-1.5 md:px-2 lg:py-2 lg:px-3 text-white hover:bg-blue-700 rounded transition duration-200 text-base md:text-sm lg:text-base">
            Profile Management
          </Link>
          <Link to="/t-settings" className="py-2 px-3 md:py-1.5 md:px-2 lg:py-2 lg:px-3 text-white hover:bg-blue-700 rounded transition duration-200 text-base md:text-sm lg:text-base">
            Settings
          </Link>
        </div>

        {/* Logout button at the bottom */}
        <button
          onClick={handleLogout}
          className="mt-auto py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center gap-2 transition-colors duration-200"
        >
          <FiLogOut /> Logout
        </button>
      </nav>

      {/* Main Content Area */}
      <section
        className={`transition-all duration-300 ease-in-out flex-1 p-5 sm:p-6 lg:p-8
          ${isSidebarOpen ? 'md:ml-60 lg:ml-64' : 'ml-0'}
          ${windowWidth >= 768 ? 'ml-0' : ''}
        `}
      >
        {children}
      </section>
    </div>
  );
};

export default SideBar