import React, { useState, useEffect } from 'react';
import SideBar from '../../TherapistSideBar';

const TherapistSessionNotes = () => {
  // State for form data
  const [formData, setFormData] = useState({
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    sessionNumber: '',
    presentingIssues: '',
    sessionContent: '',
    interventionsUsed: '',
    clientResponse: '',
    homeworkAssigned: '',
    nextSessionPlan: '',
    additionalNotes: ''
  });

  // State for notes list
  const [notesList, setNotesList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);

  // Load saved notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('therapistNotes');
    if (savedNotes) {
      setNotesList(JSON.parse(savedNotes));
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      // Update existing note
      const updatedNotes = notesList.map(note => 
        note.id === currentNoteId ? { ...formData, id: currentNoteId } : note
      );
      setNotesList(updatedNotes);
      localStorage.setItem('therapistNotes', JSON.stringify(updatedNotes));
      setIsEditing(false);
      setCurrentNoteId(null);
    } else {
      // Add new note
      const newNote = { ...formData, id: Date.now() };
      const updatedNotes = [...notesList, newNote];
      setNotesList(updatedNotes);
      localStorage.setItem('therapistNotes', JSON.stringify(updatedNotes));
    }
    
    // Reset form
    setFormData({
      clientName: '',
      date: new Date().toISOString().split('T')[0],
      sessionNumber: '',
      presentingIssues: '',
      sessionContent: '',
      interventionsUsed: '',
      clientResponse: '',
      homeworkAssigned: '',
      nextSessionPlan: '',
      additionalNotes: ''
    });
  };

  // Edit a note
  const handleEdit = (note) => {
    setFormData(note);
    setIsEditing(true);
    setCurrentNoteId(note.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete a note
  const handleDelete = (id) => {
    const updatedNotes = notesList.filter(note => note.id !== id);
    setNotesList(updatedNotes);
    localStorage.setItem('therapistNotes', JSON.stringify(updatedNotes));
    
    if (isEditing && id === currentNoteId) {
      setIsEditing(false);
      setCurrentNoteId(null);
      setFormData({
        clientName: '',
        date: new Date().toISOString().split('T')[0],
        sessionNumber: '',
        presentingIssues: '',
        sessionContent: '',
        interventionsUsed: '',
        clientResponse: '',
        homeworkAssigned: '',
        nextSessionPlan: '',
        additionalNotes: ''
      });
    }
  };

  return (
    <SideBar>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1 style={styles.title}>Session Notes</h1>
          <p style={styles.subtitle}>Document and track client sessions</p>
        </header>

        <main style={styles.main}>
          <section style={styles.formSection}>
            <h2 style={styles.sectionTitle}>{isEditing ? 'Edit Session Note' : 'New Session Note'}</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label htmlFor="clientName" style={styles.label}>Client Name:</label>
                  <input
                    type="text"
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="date" style={styles.label}>Date:</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="sessionNumber" style={styles.label}>Session #:</label>
                  <input
                    type="number"
                    id="sessionNumber"
                    name="sessionNumber"
                    value={formData.sessionNumber}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label htmlFor="presentingIssues" style={styles.label}>Presenting Issues:</label>
                <textarea
                  id="presentingIssues"
                  name="presentingIssues"
                  value={formData.presentingIssues}
                  onChange={handleChange}
                  style={{...styles.input, ...styles.textarea}}
                  rows="3"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label htmlFor="sessionContent" style={styles.label}>Session Content:</label>
                <textarea
                  id="sessionContent"
                  name="sessionContent"
                  value={formData.sessionContent}
                  onChange={handleChange}
                  style={{...styles.input, ...styles.textarea}}
                  rows="5"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label htmlFor="interventionsUsed" style={styles.label}>Interventions Used:</label>
                <textarea
                  id="interventionsUsed"
                  name="interventionsUsed"
                  value={formData.interventionsUsed}
                  onChange={handleChange}
                  style={{...styles.input, ...styles.textarea}}
                  rows="3"
                />
              </div>
              
              <div style={styles.formGroup}>
                <label htmlFor="clientResponse" style={styles.label}>Client Response:</label>
                <textarea
                  id="clientResponse"
                  name="clientResponse"
                  value={formData.clientResponse}
                  onChange={handleChange}
                  style={{...styles.input, ...styles.textarea}}
                  rows="3"
                />
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label htmlFor="homeworkAssigned" style={styles.label}>Homework Assigned:</label>
                  <textarea
                    id="homeworkAssigned"
                    name="homeworkAssigned"
                    value={formData.homeworkAssigned}
                    onChange={handleChange}
                    style={{...styles.input, ...styles.textarea}}
                    rows="2"
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label htmlFor="nextSessionPlan" style={styles.label}>Next Session Plan:</label>
                  <textarea
                    id="nextSessionPlan"
                    name="nextSessionPlan"
                    value={formData.nextSessionPlan}
                    onChange={handleChange}
                    style={{...styles.input, ...styles.textarea}}
                    rows="2"
                  />
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label htmlFor="additionalNotes" style={styles.label}>Additional Notes:</label>
                <textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  style={{...styles.input, ...styles.textarea}}
                  rows="3"
                />
              </div>
              
              <div style={styles.buttonGroup}>
                <button type="submit" style={styles.primaryButton}>
                  {isEditing ? 'Update Note' : 'Save Note'}
                </button>
                {isEditing && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentNoteId(null);
                      setFormData({
                        clientName: '',
                        date: new Date().toISOString().split('T')[0],
                        sessionNumber: '',
                        presentingIssues: '',
                        sessionContent: '',
                        interventionsUsed: '',
                        clientResponse: '',
                        homeworkAssigned: '',
                        nextSessionPlan: '',
                        additionalNotes: ''
                      });
                    }}
                    style={styles.secondaryButton}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
          
          <section style={styles.notesSection}>
            <h2 style={styles.sectionTitle}>Session Notes History</h2>
            {notesList.length === 0 ? (
              <p style={styles.noNotes}>No session notes yet. Add your first note above.</p>
            ) : (
              <div style={styles.notesGrid}>
                {notesList.map(note => (
                  <div key={note.id} style={styles.noteCard}>
                    <div style={styles.noteHeader}>
                      <h3 style={styles.noteTitle}>{note.clientName} - Session #{note.sessionNumber}</h3>
                      <p style={styles.noteDate}>{new Date(note.date).toLocaleDateString()}</p>
                    </div>
                    <div style={styles.noteContent}>
                      <p><strong>Presenting Issues:</strong> {note.presentingIssues}</p>
                      <p><strong>Session Content:</strong> {note.sessionContent.substring(0, 100)}...</p>
                    </div>
                    <div style={styles.noteActions}>
                      <button 
                        onClick={() => handleEdit(note)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(note.id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </SideBar>
  );
};

// CSS styles using JSX
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    lineHeight: 1.6,
    color: '#333',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    marginLeft: '250px', // Adjust based on your sidebar width
  },
  header: {
    backgroundColor: '#4a6fa5',
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '30px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  title: {
    margin: '0',
    fontSize: '2rem',
  },
  subtitle: {
    margin: '10px 0 0',
    fontSize: '1rem',
    opacity: 0.9,
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
  },
  formSection: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  notesSection: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    marginBottom: '40px',
  },
  sectionTitle: {
    color: '#4a6fa5',
    marginTop: '0',
    marginBottom: '20px',
    fontSize: '1.5rem',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formRow: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },
  formGroup: {
    flex: '1',
    minWidth: '250px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  textarea: {
    minHeight: '80px',
    resize: 'vertical',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
  },
  primaryButton: {
    backgroundColor: '#4a6fa5',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#3a5a8f',
    },
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    color: '#555',
    border: '1px solid #ddd',
    padding: '12px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
  editButton: {
    backgroundColor: '#4a6fa5',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginRight: '10px',
    '&:hover': {
      backgroundColor: '#3a5a8f',
    },
  },
  deleteButton: {
    backgroundColor: '#d9534f',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    '&:hover': {
      backgroundColor: '#c9302c',
    },
  },
  notesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  noteCard: {
    border: '1px solid #eee',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
  },
  noteHeader: {
    marginBottom: '15px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  noteTitle: {
    margin: '0 0 5px 0',
    color: '#4a6fa5',
    fontSize: '1.1rem',
  },
  noteDate: {
    margin: '0',
    color: '#777',
    fontSize: '0.9rem',
  },
  noteContent: {
    flex: '1',
    marginBottom: '15px',
  },
  noteActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  noNotes: {
    textAlign: 'center',
    color: '#777',
    padding: '20px',
  },
};

export default TherapistSessionNotes;