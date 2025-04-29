import React, { useState } from 'react';
import SideBar from '../../PatientSideBar';
import StarRating from '../../../StarRating';
import '../../../Feedback.css';

const Feedback = () => {
  const [feedback, setFeedback] = useState({
    rating: 0,
    comments: '',
    therapistHelpfulness: 3,
    sessionQuality: 3,
    wouldRecommend: true,
    anonymous: false
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFeedback(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRatingChange = (newRating) => {
    setFeedback(prev => ({ ...prev, rating: newRating }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the feedback to your backend
    console.log('Submitting feedback:', feedback);
    setSubmitted(true);
  };

  return (
    <SideBar>
      <div className="feedback-container">
        {submitted ? (
          <div className="thank-you-message">
            <h2>Thank You for Your Feedback!</h2>
            <p>Your feedback helps us improve our services.</p>
            <button 
              className="btn return-btn"
              onClick={() => window.location.href = '/dashboard'}
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <>
            <h1>Session Feedback</h1>
            <p className="session-info">We value your feedback about your recent therapy session</p>
            
            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="form-group">
                <label>Overall Rating</label>
                <StarRating 
                  rating={feedback.rating} 
                  onRatingChange={handleRatingChange} 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="therapistHelpfulness">
                  How helpful was your therapist?
                </label>
                <select
                  id="therapistHelpfulness"
                  name="therapistHelpfulness"
                  value={feedback.therapistHelpfulness}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="1">Not at all helpful</option>
                  <option value="2">Slightly helpful</option>
                  <option value="3">Moderately helpful</option>
                  <option value="4">Very helpful</option>
                  <option value="5">Extremely helpful</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="sessionQuality">
                  How would you rate the quality of this session?
                </label>
                <select
                  id="sessionQuality"
                  name="sessionQuality"
                  value={feedback.sessionQuality}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="1">Poor</option>
                  <option value="2">Fair</option>
                  <option value="3">Good</option>
                  <option value="4">Very Good</option>
                  <option value="5">Excellent</option>
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="wouldRecommend"
                  name="wouldRecommend"
                  checked={feedback.wouldRecommend}
                  onChange={handleChange}
                />
                <label htmlFor="wouldRecommend">
                  I would recommend this therapist to others
                </label>
              </div>
              
              <div className="form-group">
                <label htmlFor="comments">Additional Comments</label>
                <textarea
                  id="comments"
                  name="comments"
                  value={feedback.comments}
                  onChange={handleChange}
                  className="form-control"
                  rows="5"
                  placeholder="What worked well? What could be improved?"
                />
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="anonymous"
                  name="anonymous"
                  checked={feedback.anonymous}
                  onChange={handleChange}
                />
                <label htmlFor="anonymous">
                  Submit feedback anonymously
                </label>
              </div>
              
              <button type="submit" className="btn submit-btn">
                Submit Feedback
              </button>
            </form>
          </>
        )}
      </div>
    </SideBar>
  );
};

export default Feedback;