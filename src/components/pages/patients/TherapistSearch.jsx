import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiX, FiStar, FiMapPin, FiClock, FiDollarSign } from 'react-icons/fi';import SideBar from '../../PatientSideBar'


const TherapistSearch = () => {
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [therapists, setTherapists] = useState([]);
  const [filteredTherapists, setFilteredTherapists] = useState([]);
  
  // Filter state
  const [filters, setFilters] = useState({
    specialties: [],
    languages: [],
    availability: 'any',
    priceRange: [0, 150],
    rating: 0
  });

  // Available options for filters
  const filterOptions = {
    specialties: [
      'Postpartum Depression',
      'Pregnancy Anxiety',
      'Birth Trauma',
      'Infertility',
      'Parenting Support'
    ],
    languages: ['English', 'Spanish', 'French', 'Mandarin', 'Arabic'],
    availability: ['Any', 'Morning', 'Afternoon', 'Evening', 'Weekends']
  };

  // Fetch therapists (simulated)
  useEffect(() => {
    const fetchTherapists = async () => {
      // Simulate API call
      setTimeout(() => {
        const mockTherapists = [
          {
            id: 1,
            name: "Dr. Emily Johnson",
            specialty: "Postpartum Depression",
            rating: 4.8,
            reviews: 42,
            price: 80,
            languages: ["English", "Spanish"],
            availability: ["Morning", "Afternoon"],
            verified: true,
            photo: "https://randomuser.me/api/portraits/women/44.jpg",
            bio: "Specializing in perinatal mood disorders with 10 years of experience."
          },
          {
            id: 2,
            name: "Dr. Michael Chen",
            specialty: "Pregnancy Anxiety",
            rating: 4.6,
            reviews: 28,
            price: 75,
            languages: ["English", "Mandarin"],
            availability: ["Afternoon", "Evening"],
            verified: true,
            photo: "https://randomuser.me/api/portraits/men/32.jpg",
            bio: "Cognitive Behavioral Therapy expert focusing on pregnancy-related anxiety."
          },
          {
            id: 3,
            name: "Dr. Sarah Williams",
            specialty: "Birth Trauma",
            rating: 4.9,
            reviews: 35,
            price: 90,
            languages: ["English"],
            availability: ["Morning", "Weekends"],
            verified: true,
            photo: "https://randomuser.me/api/portraits/women/68.jpg",
            bio: "Trauma-informed care specialist for birth-related PTSD."
          }
        ];
        setTherapists(mockTherapists);
        setFilteredTherapists(mockTherapists);
        setLoading(false);
      }, 1000);
    };

    fetchTherapists();
  }, []);

  // Apply filters
  useEffect(() => {
    let results = therapists;
    
    // Search term filter
    if (searchTerm) {
      results = results.filter(therapist =>
        therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Specialty filter
    if (filters.specialties.length > 0) {
      results = results.filter(therapist =>
        filters.specialties.includes(therapist.specialty)
      );
    }
    
    // Language filter
    if (filters.languages.length > 0) {
      results = results.filter(therapist =>
        filters.languages.some(lang => therapist.languages.includes(lang))
      );
    }
    
    // Availability filter
    if (filters.availability !== 'any') {
      results = results.filter(therapist =>
        therapist.availability.includes(filters.availability)
      );
    }
    
    // Price filter
    results = results.filter(therapist =>
      therapist.price >= filters.priceRange[0] &&
      therapist.price <= filters.priceRange[1]
    );
    
    // Rating filter
    if (filters.rating > 0) {
      results = results.filter(therapist =>
        therapist.rating >= filters.rating
      );
    }
    
    setFilteredTherapists(results);
  }, [searchTerm, filters, therapists]);

  const toggleSpecialty = (specialty) => {
    setFilters(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const toggleLanguage = (language) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const resetFilters = () => {
    setFilters({
      specialties: [],
      languages: [],
      availability: 'any',
      priceRange: [0, 150],
      rating: 0
    });
    setSearchTerm('');
  };

  return (
    <SideBar>
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-indigo-900 mb-2">Find Your Therapist</h1>
          <p className="text-gray-600">
            Connect with licensed professionals specializing in maternal mental health
          </p>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name, specialty, or keyword..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <FiFilter className="mr-2" />
              Filters
              {filters.specialties.length > 0 || filters.languages.length > 0 || filters.rating > 0 ? (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">
                  {filters.specialties.length + filters.languages.length + (filters.rating > 0 ? 1 : 0)}
                </span>
              ) : null}
            </button>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Specialties Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Specialties</h3>
                  <div className="space-y-2">
                    {filterOptions.specialties.map(specialty => (
                      <label key={specialty} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.specialties.includes(specialty)}
                          onChange={() => toggleSpecialty(specialty)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{specialty}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Languages Filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Languages</h3>
                  <div className="space-y-2">
                    {filterOptions.languages.map(language => (
                      <label key={language} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.languages.includes(language)}
                          onChange={() => toggleLanguage(language)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-gray-700">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Other Filters */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Availability</h3>
                    <select
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      value={filters.availability}
                      onChange={(e) => setFilters({...filters, availability: e.target.value})}
                    >
                      {filterOptions.availability.map(option => (
                        <option key={option} value={option.toLowerCase()}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Minimum Rating</h3>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setFilters({...filters, rating: star})}
                          className={`${star <= filters.rating ? 'text-yellow-400' : 'text-gray-300'} focus:outline-none`}
                        >
                          <FiStar className="w-5 h-5 fill-current" />
                        </button>
                      ))}
                      {filters.rating > 0 && (
                        <button
                          onClick={() => setFilters({...filters, rating: 0})}
                          className="ml-2 text-gray-400 hover:text-gray-500"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    </h3>
                    <div className="px-2">
                      <input
                        type="range"
                        min="0"
                        max="150"
                        step="10"
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-600">
            {filteredTherapists.length} {filteredTherapists.length === 1 ? 'therapist' : 'therapists'} found
          </p>
          <div className="flex items-center">
            <label htmlFor="sort" className="text-sm text-gray-600 mr-2">Sort by:</label>
            <select
              id="sort"
              className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option>Relevance</option>
              <option>Highest Rated</option>
              <option>Most Affordable</option>
              <option>Soonest Availability</option>
            </select>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
                <div className="flex space-x-4">
                  <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Results */}
        {!loading && filteredTherapists.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No therapists found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
            <button 
              onClick={resetFilters}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTherapists.map(therapist => (
              <div key={therapist.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/4 p-6 bg-indigo-50 flex flex-col items-center justify-center">
                    <img 
                      src={therapist.photo} 
                      alt={therapist.name}
                      className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    {therapist.verified && (
                      <div className="mt-2 flex items-center text-sm text-green-600">
                        <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </div>
                    )}
                  </div>
                  
                  <div className="md:w-3/4 p-6">
                    <div className="flex justify-between">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">{therapist.name}</h2>
                        <p className="text-indigo-600 font-medium">{therapist.specialty}</p>
                      </div>
                      <div className="flex items-center">
                        <FiStar className="text-yellow-400 fill-current" />
                        <span className="ml-1 font-medium">{therapist.rating}</span>
                        <span className="text-gray-500 ml-1">({therapist.reviews})</span>
                      </div>
                    </div>
                    
                    <p className="mt-2 text-gray-600">{therapist.bio}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiDollarSign className="mr-1" />
                        ${therapist.price}/session
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiMapPin className="mr-1" />
                        {therapist.languages.join(', ')}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiClock className="mr-1" />
                        {therapist.availability.join(', ')}
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Link
                        to={`/therapist/${therapist.id}`}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    
        </SideBar>
  )
}

export default TherapistSearch