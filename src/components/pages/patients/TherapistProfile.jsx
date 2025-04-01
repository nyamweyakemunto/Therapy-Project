import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SideBar from '../../sideBar';
import '../../../TherapistProfile.css';

const TherapistProfile = () => {
  const { id } = useParams();
  const [therapist, setTherapist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        // Mock data - replace with actual API call
        const mockTherapist = {
          id: id,
          name: "Dr. Sarah Johnson",
          title: "Licensed Clinical Psychologist",
          specialty: "Anxiety, Depression, Trauma",
          experience: "10 years",
          education: "PhD in Clinical Psychology, Stanford University",
          approach: "Cognitive Behavioral Therapy (CBT), Mindfulness-based approaches",
          bio: "Dr. Johnson specializes in helping adults navigate life transitions, anxiety, and relationship issues.",
          imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
          languages: ["English", "Spanish"],
          availability: ["Mon", "Wed", "Fri"],
          sessionRate: "$150 per 50-minute session",
          reviews: [
            { id: 1, author: "James P.", rating: 5, comment: "Dr. Johnson has been incredibly helpful." },
            { id: 2, author: "Maria G.", rating: 4, comment: "Very professional and caring approach." }
          ]
        };
        
        setTherapist(mockTherapist);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [id]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    console.log(`Booking request for ${therapist.name} at ${bookingDate} ${bookingTime}`);
    setIsBooking(false);
    alert(`Appointment requested with ${therapist.name} for ${bookingDate} at ${bookingTime}`);
  };

  if (loading) return <SideBar><div className="loading">Loading therapist profile...</div></SideBar>;
  if (error) return <SideBar><div className="error">Error: {error}</div></SideBar>;

  return (
    <SideBar>
      <div className="therapist-profile-container">
        <div className="therapist-profile">
          <div className="profile-header">
            <div className="profile-image">
              <img src={therapist.imageUrl} alt={therapist.name} />
            </div>
            <div className="profile-info">
              <h1>{therapist.name}</h1>
              <h2>{therapist.title}</h2>
              <div className="specialty">{therapist.specialty}</div>
              <div className="rate">{therapist.sessionRate}</div>
              <button 
                className="book-button"
                onClick={() => setIsBooking(true)}
              >
                Book a Session
              </button>
            </div>
          </div>

          <div className="profile-details">
            <section className="about-section">
              <h3>About Me</h3>
              <p>{therapist.bio}</p>
            </section>

            <section className="credentials-section">
              <h3>Credentials</h3>
              <ul>
                <li><strong>Experience:</strong> {therapist.experience}</li>
                <li><strong>Education:</strong> {therapist.education}</li>
                <li><strong>Therapeutic Approach:</strong> {therapist.approach}</li>
                <li><strong>Languages:</strong> {therapist.languages.join(', ')}</li>
                <li><strong>Availability:</strong> {therapist.availability.join(', ')}</li>
              </ul>
            </section>

            <section className="reviews-section">
              <h3>Client Reviews</h3>
              <div className="reviews-list">
                {therapist.reviews.map(review => (
                  <div key={review.id} className="review">
                    <div className="review-header">
                      <span className="review-author">{review.author}</span>
                      <span className="review-rating">
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {isBooking && (
            <div className="booking-modal">
              <div className="booking-form">
                <h2>Book a Session with {therapist.name}</h2>
                <form onSubmit={handleBookingSubmit}>
                  <div className="form-group">
                    <label htmlFor="booking-date">Date:</label>
                    <input
                      type="date"
                      id="booking-date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="booking-time">Time:</label>
                    <input
                      type="time"
                      id="booking-time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={() => setIsBooking(false)}>
                      Cancel
                    </button>
                    <button type="submit">Request Appointment</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </SideBar>
  );
};

export default TherapistProfile;