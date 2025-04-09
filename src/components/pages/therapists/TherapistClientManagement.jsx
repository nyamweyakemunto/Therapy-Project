import React, { useState, useEffect } from 'react';
import SideBar from '../../TherapistSideBar';

const TherapistClientManagement = () => {
  // State for clients data
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);

  // Form state for adding/editing clients
  const [clientForm, setClientForm] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    joinDate: '',
    status: 'active',
    notes: [],
    nextSession: ''
  });

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockClients = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '555-123-4567',
        joinDate: '2023-01-15',
        status: 'active',
        notes: [
          { date: '2023-05-10', content: 'Reported improved sleep patterns.' },
          { date: '2023-04-28', content: 'Discussed coping strategies for anxiety.' }
        ],
        nextSession: '2023-06-15'
      },
      {
        id: '2',
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        phone: '555-987-6543',
        joinDate: '2023-02-20',
        status: 'active',
        notes: [
          { date: '2023-05-12', content: 'Working on communication skills.' }
        ],
        nextSession: '2023-06-18'
      },
      {
        id: '3',
        name: 'Emma Rodriguez',
        email: 'emma.rodriguez@example.com',
        phone: '555-456-7890',
        joinDate: '2022-11-05',
        status: 'inactive',
        notes: [
          { date: '2023-03-15', content: 'Completed treatment plan.' },
          { date: '2023-02-28', content: 'Showing significant progress.' }
        ],
        nextSession: ''
      }
    ];
    setClients(mockClients);
    setFilteredClients(mockClients);
  }, []);

  // Filter clients based on search term and active tab
  useEffect(() => {
    let results = clients;
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status tab
    if (activeTab !== 'all') {
      results = results.filter(client => client.status === activeTab);
    }
    
    setFilteredClients(results);
  }, [searchTerm, activeTab, clients]);

  // Handle client selection
  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setIsEditing(false);
    setNewNote('');
  };

  // Handle adding a new note
  const handleAddNote = () => {
    if (!newNote.trim()) return;
    
    const updatedNote = {
      date: new Date().toISOString().split('T')[0],
      content: newNote
    };
    
    const updatedClients = clients.map(client =>
      client.id === selectedClient.id
        ? { ...client, notes: [...client.notes, updatedNote] }
        : client
    );
    
    setClients(updatedClients);
    setSelectedClient({ ...selectedClient, notes: [...selectedClient.notes, updatedNote] });
    setNewNote('');
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientForm({ ...clientForm, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing client
      const updatedClients = clients.map(client =>
        client.id === clientForm.id ? clientForm : client
      );
      setClients(updatedClients);
      setSelectedClient(clientForm);
    } else {
      // Add new client
      const newClient = {
        ...clientForm,
        id: Date.now().toString(),
        joinDate: new Date().toISOString().split('T')[0],
        notes: []
      };
      setClients([...clients, newClient]);
      setSelectedClient(newClient);
    }
    
    setShowModal(false);
    setIsEditing(false);
    setClientForm({
      id: '',
      name: '',
      email: '',
      phone: '',
      joinDate: '',
      status: 'active',
      notes: [],
      nextSession: ''
    });
  };

  // Handle editing a client
  const handleEditClient = () => {
    setClientForm(selectedClient);
    setIsEditing(true);
    setShowModal(true);
  };

  // Handle deleting a client
  const handleDeleteClient = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedClient.name}?`)) {
      const updatedClients = clients.filter(client => client.id !== selectedClient.id);
      setClients(updatedClients);
      setSelectedClient(null);
    }
  };

  // Styles
  const styles = {
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    searchBox: {
      padding: '10px',
      width: '300px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      fontSize: '16px'
    },
    addButton: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s',
      '&:hover': {
        backgroundColor: '#2980b9'
      }
    },
    tabs: {
      display: 'flex',
      marginBottom: '20px',
      borderBottom: '1px solid #ddd'
    },
    tab: {
      padding: '10px 20px',
      cursor: 'pointer',
      marginRight: '5px',
      borderRadius: '5px 5px 0 0',
      backgroundColor: '#eee',
      transition: 'background-color 0.3s'
    },
    activeTab: {
      backgroundColor: '#3498db',
      color: 'white'
    },
    clientList: {
      backgroundColor: 'white',
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    clientItem: {
      padding: '15px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#f0f5ff'
      }
    },
    selectedClientItem: {
      backgroundColor: '#e1f0ff'
    },
    clientStatus: {
      display: 'inline-block',
      padding: '3px 8px',
      borderRadius: '10px',
      fontSize: '12px',
      fontWeight: 'bold'
    },
    activeStatus: {
      backgroundColor: '#d4edda',
      color: '#155724'
    },
    inactiveStatus: {
      backgroundColor: '#f8d7da',
      color: '#721c24'
    },
    clientDetails: {
      backgroundColor: 'white',
      borderRadius: '5px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      padding: '20px',
      marginTop: '20px'
    },
    detailHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      borderBottom: '1px solid #eee',
      paddingBottom: '15px'
    },
    detailTitle: {
      fontSize: '24px',
      margin: '0'
    },
    actionButtons: {
      display: 'flex',
      gap: '10px'
    },
    actionButton: {
      padding: '8px 12px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.3s'
    },
    editButton: {
      backgroundColor: '#ffc107',
      color: '#212529',
      '&:hover': {
        backgroundColor: '#e0a800'
      }
    },
    deleteButton: {
      backgroundColor: '#dc3545',
      color: 'white',
      '&:hover': {
        backgroundColor: '#c82333'
      }
    },
    detailGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      marginBottom: '20px'
    },
    detailItem: {
      marginBottom: '10px'
    },
    detailLabel: {
      fontWeight: 'bold',
      color: '#555',
      marginBottom: '5px',
      display: 'block'
    },
    notesSection: {
      marginTop: '30px'
    },
    notesTitle: {
      fontSize: '18px',
      marginBottom: '15px',
      paddingBottom: '10px',
      borderBottom: '1px solid #eee'
    },
    notesList: {
      maxHeight: '300px',
      overflowY: 'auto',
      marginBottom: '20px'
    },
    noteItem: {
      padding: '15px',
      border: '1px solid #eee',
      borderRadius: '5px',
      marginBottom: '10px',
      backgroundColor: '#f9f9f9'
    },
    noteDate: {
      fontSize: '12px',
      color: '#777',
      marginBottom: '5px'
    },
    noteForm: {
      display: 'flex',
      marginTop: '20px'
    },
    noteInput: {
      flex: 1,
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      fontSize: '16px',
      marginRight: '10px',
      minHeight: '80px'
    },
    noteButton: {
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s',
      '&:hover': {
        backgroundColor: '#218838'
      }
    },
    modal: {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '1000'
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      width: '500px',
      maxWidth: '90%'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px'
    },
    modalTitle: {
      fontSize: '20px',
      margin: '0'
    },
    closeButton: {
      backgroundColor: 'transparent',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#777'
    },
    formGroup: {
      marginBottom: '20px'
    },
    formLabel: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: 'bold'
    },
    formInput: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      fontSize: '16px'
    },
    formSelect: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      fontSize: '16px',
      backgroundColor: 'white'
    },
    submitButton: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
      width: '100%',
      transition: 'background-color 0.3s',
      '&:hover': {
        backgroundColor: '#2980b9'
      }
    }
  };

  return (
    <SideBar>
      <div style={{ padding: '20px' }}>
        <div style={styles.header}>
          <input
            type="text"
            placeholder="Search clients..."
            style={styles.searchBox}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            style={styles.addButton} 
            onClick={() => {
              setShowModal(true);
              setIsEditing(false);
            }}
          >
            Add New Client
          </button>
        </div>
        
        {/* Tabs */}
        <div style={styles.tabs}>
          <div 
            style={{ ...styles.tab, ...(activeTab === 'all' && styles.activeTab) }}
            onClick={() => setActiveTab('all')}
          >
            All Clients
          </div>
          <div 
            style={{ ...styles.tab, ...(activeTab === 'active' && styles.activeTab) }}
            onClick={() => setActiveTab('active')}
          >
            Active
          </div>
          <div 
            style={{ ...styles.tab, ...(activeTab === 'inactive' && styles.activeTab) }}
            onClick={() => setActiveTab('inactive')}
          >
            Inactive
          </div>
        </div>
        
        {/* Client List */}
        <div style={styles.clientList}>
          {filteredClients.length > 0 ? (
            filteredClients.map(client => (
              <div 
                key={client.id} 
                style={{ 
                  ...styles.clientItem, 
                  ...(selectedClient?.id === client.id && styles.selectedClientItem) 
                }}
                onClick={() => handleSelectClient(client)}
              >
                <div>
                  <h4 style={{ margin: '0 0 5px 0' }}>{client.name}</h4>
                  <p style={{ margin: '0', color: '#666' }}>{client.email}</p>
                </div>
                <span style={{ 
                  ...styles.clientStatus, 
                  ...(client.status === 'active' ? styles.activeStatus : styles.inactiveStatus) 
                }}>
                  {client.status}
                </span>
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              No clients found
            </div>
          )}
        </div>
        
        {/* Client Details */}
        {selectedClient && (
          <div style={styles.clientDetails}>
            <div style={styles.detailHeader}>
              <h2 style={styles.detailTitle}>{selectedClient.name}</h2>
              <div style={styles.actionButtons}>
                <button 
                  style={{ ...styles.actionButton, ...styles.editButton }}
                  onClick={handleEditClient}
                >
                  Edit
                </button>
                <button 
                  style={{ ...styles.actionButton, ...styles.deleteButton }}
                  onClick={handleDeleteClient}
                >
                  Delete
                </button>
              </div>
            </div>
            
            <div style={styles.detailGrid}>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Email</span>
                <div>{selectedClient.email}</div>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Phone</span>
                <div>{selectedClient.phone}</div>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Join Date</span>
                <div>{selectedClient.joinDate}</div>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Status</span>
                <div>
                  <span style={{ 
                    ...styles.clientStatus, 
                    ...(selectedClient.status === 'active' ? styles.activeStatus : styles.inactiveStatus) 
                  }}>
                    {selectedClient.status}
                  </span>
                </div>
              </div>
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Next Session</span>
                <div>{selectedClient.nextSession || 'Not scheduled'}</div>
              </div>
            </div>
            
            <div style={styles.notesSection}>
              <h3 style={styles.notesTitle}>Session Notes</h3>
              
              {selectedClient.notes.length > 0 ? (
                <div style={styles.notesList}>
                  {selectedClient.notes.map((note, index) => (
                    <div key={index} style={styles.noteItem}>
                      <div style={styles.noteDate}>{note.date}</div>
                      <div>{note.content}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No notes yet for this client.</p>
              )}
              
              <div style={styles.noteForm}>
                <textarea
                  style={styles.noteInput}
                  placeholder="Add a new note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <button 
                  style={styles.noteButton}
                  onClick={handleAddNote}
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Add/Edit Client Modal */}
      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {isEditing ? 'Edit Client' : 'Add New Client'}
              </h3>
              <button 
                style={styles.closeButton}
                onClick={() => {
                  setShowModal(false);
                  setIsEditing(false);
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  style={styles.formInput}
                  value={clientForm.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Email</label>
                <input
                  type="email"
                  name="email"
                  style={styles.formInput}
                  value={clientForm.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  style={styles.formInput}
                  value={clientForm.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Status</label>
                <select
                  name="status"
                  style={styles.formSelect}
                  value={clientForm.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Next Session Date</label>
                <input
                  type="date"
                  name="nextSession"
                  style={styles.formInput}
                  value={clientForm.nextSession}
                  onChange={handleInputChange}
                />
              </div>
              
              <button type="submit" style={styles.submitButton}>
                {isEditing ? 'Update Client' : 'Add Client'}
              </button>
            </form>
          </div>
        </div>
      )}
    </SideBar>
  );
};

export default TherapistClientManagement;