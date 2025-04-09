import React, { useState } from 'react';
import SideBar from '../../TherapistSideBar';

const TherapistResources = () => {
  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Sample resource data
  const resources = [
    {
      id: 1,
      title: 'Cognitive Behavioral Therapy Techniques',
      category: 'CBT',
      description: 'A comprehensive guide to CBT techniques for various mental health conditions.',
      link: '#',
      isFavorite: false
    },
    {
      id: 2,
      title: 'Child Development Milestones',
      category: 'Pediatrics',
      description: 'Detailed chart showing typical developmental milestones from birth to adolescence.',
      link: '#',
      isFavorite: true
    },
    {
      id: 3,
      title: 'Mindfulness Meditation Exercises',
      category: 'Mindfulness',
      description: 'Audio files and scripts for guided mindfulness sessions with clients.',
      link: '#',
      isFavorite: false
    },
    {
      id: 4,
      title: 'Trauma-Informed Care Principles',
      category: 'Trauma',
      description: 'Best practices for implementing trauma-informed approaches in therapy.',
      link: '#',
      isFavorite: true
    },
    {
      id: 5,
      title: 'DSM-5 Quick Reference Guide',
      category: 'Reference',
      description: 'Condensed version of DSM-5 diagnostic criteria for common disorders.',
      link: '#',
      isFavorite: false
    },
    {
      id: 6,
      title: 'Therapeutic Play Activities',
      category: 'Pediatrics',
      description: 'Creative play-based interventions for child therapy sessions.',
      link: '#',
      isFavorite: false
    },
  ];

  // Toggle favorite status
  const toggleFavorite = (id) => {
    const updatedResources = resources.map(resource => 
      resource.id === id ? {...resource, isFavorite: !resource.isFavorite} : resource
    );
    // In a real app, you would update state here
  };

  // Get unique categories
  const categories = ['All', ...new Set(resources.map(resource => resource.category))];

  // Filter resources based on search and category
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SideBar>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Therapist Education Resources</h1>
          <p style={styles.subtitle}>Evidence-based materials to support your practice</p>
        </header>
        
        <div style={styles.controls}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            <button style={styles.searchButton}>
              <i className="fas fa-search" style={styles.icon}></i>
            </button>
          </div>
          
          <div style={styles.categoryFilter}>
            <label htmlFor="category" style={styles.filterLabel}>Filter by category:</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={styles.filterSelect}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div style={styles.resourceGrid}>
          {filteredResources.length > 0 ? (
            filteredResources.map(resource => (
              <div key={resource.id} style={styles.resourceCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.categoryTag}>{resource.category}</span>
                  <button 
                    onClick={() => toggleFavorite(resource.id)}
                    style={resource.isFavorite ? styles.favoriteButtonActive : styles.favoriteButton}
                  >
                    {resource.isFavorite ? '★' : '☆'}
                  </button>
                </div>
                <h3 style={styles.resourceTitle}>{resource.title}</h3>
                <p style={styles.resourceDescription}>{resource.description}</p>
                <a href={resource.link} style={styles.resourceLink}>View Resource</a>
              </div>
            ))
          ) : (
            <p style={styles.noResults}>No resources found matching your criteria.</p>
          )}
        </div>
      </div>
    </SideBar>
  );
};

// CSS styles integrated with JSX
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e1e1e1',
  },
  title: {
    color: '#2c3e50',
    fontSize: '2rem',
    marginBottom: '10px',
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '1.1rem',
    fontWeight: '300',
  },
  controls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  searchContainer: {
    display: 'flex',
    flexGrow: 1,
    maxWidth: '500px',
  },
  searchInput: {
    flexGrow: 1,
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '4px 0 0 4px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border 0.3s',
  },
  searchButton: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  icon: {
    fontSize: '16px',
  },
  categoryFilter: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  filterLabel: {
    fontSize: '16px',
    color: '#34495e',
  },
  filterSelect: {
    padding: '8px 15px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    fontSize: '16px',
    cursor: 'pointer',
  },
  resourceGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '40px',
  },
  resourceCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  categoryTag: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    padding: '4px 8px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  favoriteButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#ccc',
  },
  favoriteButtonActive: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#f1c40f',
  },
  resourceTitle: {
    color: '#2c3e50',
    fontSize: '1.1rem',
    margin: '0 0 8px 0',
  },
  resourceDescription: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    lineHeight: '1.5',
    flexGrow: 1,
    marginBottom: '15px',
  },
  resourceLink: {
    display: 'inline-block',
    backgroundColor: '#3498db',
    color: 'white',
    padding: '8px 12px',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'background-color 0.3s',
    alignSelf: 'flex-start',
    fontSize: '0.9rem',
  },
  noResults: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '1.1rem',
    padding: '30px 0',
  },
};

export default TherapistResources;