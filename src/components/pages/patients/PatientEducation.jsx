import React from 'react';
import SideBar from '../../PatientSideBar';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #4a89dc;
    --secondary: #3bafda;
    --accent: #37bc9b;
    --light: #f5f7fa;
    --dark: #434a54;
    --warning: #f6bb42;
    --danger: #e9573f;
  }
`;

const PatientEducationContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const EducationHeader = styled.header`
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: white;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const CardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  border-top: 4px solid ${props => 
    props.type === 'nutrition' ? 'var(--accent)' :
    props.type === 'exercise' ? 'var(--secondary)' :
    props.type === 'medication' ? 'var(--warning)' :
    'var(--danger)'};

  &:hover {
    transform: translateY(-5px);
  }

  h2 {
    color: var(--primary);
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--light);
  }

  ul {
    list-style-position: inside;
    margin-bottom: 1rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

const HighlightBox = styled.div`
  background: linear-gradient(135deg, var(--accent), #48cfad);
  color: white;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h2 {
    margin-bottom: 1rem;
  }
`;

const Resources = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h2 {
    color: var(--dark);
    margin-bottom: 1rem;
  }

  a {
    color: var(--primary);
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ConsultNote = styled.p`
  margin-top: 1rem;
`;

const EducationFooter = styled.footer`
  text-align: center;
  margin-top: 2rem;
  padding: 1rem;
  color: var(--dark);
  opacity: 0.8;
`;

const PatientEducation = () => {
  return (
    <SideBar>
      <GlobalStyle />
      <PatientEducationContainer>
        <EducationHeader>
          <h1>Healthy Living Guide</h1>
          <Subtitle>Your comprehensive resource for better health</Subtitle>
        </EducationHeader>
        
        <HighlightBox>
          <h2>Key Health Reminder</h2>
          <p>Remember to schedule your annual check-up and discuss any health concerns with your provider. Prevention and early detection are key to maintaining good health!</p>
        </HighlightBox>
        
        <CardContainer>
          <Card type="nutrition">
            <h2>Nutrition Tips</h2>
            <ul>
              <li>Eat a variety of colorful fruits and vegetables daily</li>
              <li>Choose whole grains over refined grains</li>
              <li>Limit processed foods and added sugars</li>
              <li>Stay hydrated with water throughout the day</li>
              <li>Practice mindful eating and portion control</li>
            </ul>
            <p><strong>Goal:</strong> Fill half your plate with fruits and vegetables at each meal.</p>
          </Card>
          
          <Card type="exercise">
            <h2>Physical Activity</h2>
            <ul>
              <li>Aim for 150 minutes of moderate exercise weekly</li>
              <li>Include strength training 2-3 times per week</li>
              <li>Take short activity breaks if you sit for long periods</li>
              <li>Find activities you enjoy to stay motivated</li>
              <li>Gradually increase intensity and duration</li>
            </ul>
            <p><strong>Tip:</strong> A 30-minute daily walk can significantly improve cardiovascular health.</p>
          </Card>
          
          <Card type="medication">
            <h2>Medication Safety</h2>
            <ul>
              <li>Take medications exactly as prescribed</li>
              <li>Keep an updated list of all medications</li>
              <li>Store medications properly in a cool, dry place</li>
              <li>Never share prescription medications</li>
              <li>Ask about potential side effects and interactions</li>
            </ul>
            <p><strong>Remember:</strong> Set reminders if you have trouble remembering doses.</p>
          </Card>
          
          <Card type="prevention">
            <h2>Preventive Care</h2>
            <ul>
              <li>Stay current with recommended screenings</li>
              <li>Keep vaccinations up to date</li>
              <li>Practice good hand hygiene</li>
              <li>Manage stress through healthy coping mechanisms</li>
              <li>Get adequate sleep (7-9 hours for adults)</li>
            </ul>
            <p><strong>Important:</strong> Don't skip routine health screenings even if you feel well.</p>
          </Card>
        </CardContainer>
        
        <Resources>
          <h2>Additional Resources</h2>
          <p>For more information about maintaining your health, visit these trusted sources:</p>
          <ul>
            <li><a href="https://www.cdc.gov/" target="_blank" rel="noopener noreferrer">Centers for Disease Control and Prevention (CDC)</a></li>
            <li><a href="https://www.heart.org/" target="_blank" rel="noopener noreferrer">American Heart Association</a></li>
            <li><a href="https://www.diabetes.org/" target="_blank" rel="noopener noreferrer">American Diabetes Association</a></li>
            <li><a href="https://www.cancer.org/" target="_blank" rel="noopener noreferrer">American Cancer Society</a></li>
          </ul>
          <ConsultNote>Always consult with your healthcare provider before making significant changes to your lifestyle or medication regimen.</ConsultNote>
        </Resources>
        
        <EducationFooter>
          <p>© {new Date().getFullYear()} Healthy Living Patient Education | Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
        </EducationFooter>
      </PatientEducationContainer>
    </SideBar>
  );
};

export default PatientEducation;