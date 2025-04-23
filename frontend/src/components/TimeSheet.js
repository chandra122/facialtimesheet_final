import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WebcamCapture from './WebcamCapture';
import { useNavigate } from 'react-router-dom';

const moodEmojis = {
  'Very Angry 😠': '😠',
  'Disgusted 🤢': '🤢',
  'Fearful 😨': '😨',
  'Happy 😊': '😊',
  'Sad 😢': '😢',
  'Surprised 😮': '😮',
  'Neutral 😐': '😐',
  'Mood Unclear 🤔': '🤔'
};

function TimeSheet() {
  const [timeSheetData, setTimeSheetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mood, setMood] = useState(null);
  const [moodDetails, setMoodDetails] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isCompletelyDone, setIsCompletelyDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTimeSheetData();
  }, []);

  const fetchTimeSheetData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/timesheet');
      setTimeSheetData(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch timesheet data');
      setLoading(false);
    }
  };

  const handleCheckIn = async (formData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/timesheet/check-in', 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      setMood(response.data.mood);
      setMoodDetails(response.data.mood_details);
      fetchTimeSheetData();
      setIsCheckedIn(true);
      setCheckInTime(new Date().toLocaleTimeString());
      setCheckOutTime(null); // Reset check-out time
    } catch (err) {
      console.error('Check-in error:', err);
      setError('Failed to check in');
    }
  };

  const handleCheckOut = async (formData) => {
    try {
        const response = await axios.post('http://localhost:5000/api/timesheet/check-out', 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        
        if (response.status === 200) {
            setIsCheckedIn(false);
            setIsCheckingOut(false);
            setCheckOutTime(response.data.check_out_time);
            setMood(response.data.mood);
            setMoodDetails(response.data.mood_details);
            setIsCompletelyDone(true);
            fetchTimeSheetData();
        }
    } catch (error) {
        console.error('Error during check-out:', error);
        setIsCheckingOut(false);
    }
  };

  const initiateCheckOut = () => {
    setIsCheckingOut(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="timesheet-container">
      <h2>TimeSheet</h2>
      {isCheckedIn ? (
        <div>
          <h3>Checked In at: {checkInTime}</h3>
          {isCheckingOut ? (
            <div style={styles.checkInSection}>
              <h2>Facial Recognition for Check Out</h2>
              <WebcamCapture onCapture={handleCheckOut} buttonText="Confirm Check Out" />
              <button onClick={() => setIsCheckingOut(false)}>Cancel</button>
            </div>
          ) : (
            <button onClick={initiateCheckOut}>Check Out</button>
          )}
        </div>
      ) : !isCompletelyDone ? (
        <div>
          <h3>You are not checked in.</h3>
          <div style={styles.checkInSection}>
            <h2>Facial Recognition for Check In</h2>
            <WebcamCapture onCapture={handleCheckIn} buttonText="Check In" />
          </div>
        </div>
      ) : (
        <div>
          <h3>Session Complete</h3>
          <button onClick={() => {
            setIsCompletelyDone(false);
            setCheckOutTime(null);
          }}>Start New Session</button>
        </div>
      )}
      {checkOutTime && <h3>Checked Out at: {checkOutTime}</h3>}

      <button onClick={() => navigate('/')}>Go to Home</button>

      <div style={styles.container}>
        {mood && (
          <div style={styles.moodContainer}>
            <h3>Current Mood</h3>
            <div style={styles.mood}>{moodEmojis[mood] || '😐'}</div>
            <div>{mood}</div>
            
            {moodDetails && (
              <div style={styles.moodDetails}>
                <h4>Emotion Details:</h4>
                <ul>
                  {moodDetails.top_emotions.map((emotion, index) => (
                    <li key={index}>
                      {emotion.emotion}: {emotion.probability}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div style={styles.timesheet}>
          <h2>TimeSheet Records</h2>
          {timeSheetData.length === 0 ? (
            <p>No timesheet records found</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Mood</th>
                </tr>
              </thead>
              <tbody>
                {timeSheetData.map((record, index) => (
                  <tr key={index}>
                    <td>{record.date}</td>
                    <td>{record.checkIn}</td>
                    <td>{record.checkOut}</td>
                    <td>{record.status}</td>
                    <td>{record.mood}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  checkInSection: {
    marginBottom: '3rem',
    padding: '2rem',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  },
  timesheet: {
    marginTop: '2rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
  },
  moodContainer: {
    marginTop: '2rem',
    textAlign: 'center',
  },
  mood: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
  },
  moodDetails: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
};

export default TimeSheet; 