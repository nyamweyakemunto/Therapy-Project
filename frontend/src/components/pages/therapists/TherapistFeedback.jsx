import React, { useState } from 'react';
import Sidebar from '../../TherapistSideBar';

const TherapistFeedback = () => {
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    professionalism: '',
    communication: '',
    empathy: '',
    effectiveness: '',
    punctuality: '',
    mostHelpful: '',
    improvements: '',
    recommend: '',
    additionalComments: '',
    anonymous: false
  });

  const handleStarClick = (value) => {
    setRating(value);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const feedbackData = {
      ...formData,
      overallRating: rating
    };
    console.log('Feedback submitted:', feedbackData);
    // Here you would typically send the data to your backend
    alert('Thank you for your feedback!');
    // Reset form
    setRating(0);
    setFormData({
      professionalism: '',
      communication: '',
      empathy: '',
      effectiveness: '',
      punctuality: '',
      mostHelpful: '',
      improvements: '',
      recommend: '',
      additionalComments: '',
      anonymous: false
    });
  };

  return (
    <Sidebar>
      <div className="therapist-feedback-container">
        <h1 className="feedback-title">Therapist Feedback Page</h1>
        <p className="feedback-intro">
          Thank you for choosing our therapy services!<br />
          Your feedback helps us improve the quality of care we provide.
        </p>

        <form onSubmit={handleSubmit} className="feedback-form">
          {/* Overall Experience */}
          <div className="feedback-section">
            <h2>1. Overall Experience</h2>
            <p>How satisfied were you with your therapy sessions?</p>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((value) => (
                <span
                  key={value}
                  className={`star ${value <= rating ? 'active' : ''}`}
                  onClick={() => handleStarClick(value)}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>

          {/* Therapist Evaluation */}
          <div className="feedback-section">
            <h2>2. Therapist Evaluation</h2>
            <p>Please rate your therapist on the following:</p>
            
            <table className="evaluation-table">
              <thead>
                <tr>
                  <th>Criteria</th>
                  <th>Excellent</th>
                  <th>Good</th>
                  <th>Average</th>
                  <th>Needs Improvement</th>
                  <th>Poor</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'professionalism', label: 'Professionalism' },
                  { name: 'communication', label: 'Communication Skills' },
                  { name: 'empathy', label: 'Empathy & Understanding' },
                  { name: 'effectiveness', label: 'Session Effectiveness' },
                  { name: 'punctuality', label: 'Punctuality & Preparedness' }
                ].map((item) => (
                  <tr key={item.name}>
                    <td>{item.label}</td>
                    {[5, 4, 3, 2, 1].map((value) => (
                      <td key={value}>
                        <input
                          type="radio"
                          name={item.name}
                          value={value}
                          checked={parseInt(formData[item.name]) === value}
                          onChange={handleChange}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Open-Ended Feedback */}
          <div className="feedback-section">
            <h2>3. Open-Ended Feedback</h2>
            <p>What did you find most helpful about your sessions?</p>
            <textarea
              name="mostHelpful"
              value={formData.mostHelpful}
              onChange={handleChange}
              placeholder="Your response here"
            />
            
            <p>Is there anything your therapist could improve?</p>
            <textarea
              name="improvements"
              value={formData.improvements}
              onChange={handleChange}
              placeholder="Your response here"
            />
            
            <p>Would you recommend this therapist to others?</p>
            <div className="recommend-options">
              <label>
                <input
                  type="radio"
                  name="recommend"
                  value="yes"
                  checked={formData.recommend === 'yes'}
                  onChange={handleChange}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="recommend"
                  value="no"
                  checked={formData.recommend === 'no'}
                  onChange={handleChange}
                  style={{ marginLeft: '15px' }}
                />
                No
              </label>
            </div>
          </div>

          {/* Additional Comments */}
          <div className="feedback-section">
            <h2>4. Additional Comments</h2>
            <p>Feel free to share any other thoughts about your experience.</p>
            <textarea
              name="additionalComments"
              value={formData.additionalComments}
              onChange={handleChange}
              placeholder="Your response here"
            />
          </div>

          {/* Anonymous Submission */}
          <div className="anonymous-option">
            <label>
              <input
                type="checkbox"
                name="anonymous"
                checked={formData.anonymous}
                onChange={handleChange}
              />
              Submit anonymously (Optional)
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-feedback-btn">
            Submit Feedback
          </button>
        </form>

        <p className="confidentiality-notice">
          Confidentiality Notice: All feedback is kept confidential and used solely for improving our services.<br />
          Thank you for your time and trust in our care! <span className="heart">💙</span>
        </p>
      </div>
    </Sidebar>
  );
};

export default TherapistFeedback;
