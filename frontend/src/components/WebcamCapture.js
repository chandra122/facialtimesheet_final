import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';

function WebcamCapture({ onCapture, buttonText = "Capture" }) {
  const webcamRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const videoConstraints = {
    width: 420,
    height: 420,
    facingMode: "user"
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const capture = React.useCallback(() => {
    setIsCapturing(true);
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        // Convert base64 to File object
        const imageFile = dataURLtoFile(imageSrc, 'capture.jpg');
        
        // Create FormData
        const formData = new FormData();
        formData.append('image', imageFile);
        
        onCapture(formData);
      }
    } catch (error) {
      console.error('Capture error:', error);
    }
    setIsCapturing(false);
  }, [onCapture]);

  return (
    <div style={styles.container}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        style={styles.webcam}
      />
      <button 
        onClick={capture}
        disabled={isCapturing}
        style={styles.button}
      >
        {buttonText}
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  webcam: {
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  button: {
    padding: '0.8rem 2rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
    '&:disabled': {
      backgroundColor: '#cccccc',
      cursor: 'not-allowed',
    },
  },
};

export default WebcamCapture; 