# Facial TimeSheet - Computer Vision Based Attendance System

A Flask-based web application that leverages computer vision and facial recognition for automated employee attendance tracking and mood analysis.

## Core Computer Vision Features

- **Facial Recognition Authentication**
  - Real-time face detection and recognition
  - Secure check-in/check-out system
  - Employee identity verification

- **Emotion Recognition & Mood Analysis**
  - Real-time emotion detection using DeepFace
  - Multi-emotion analysis (7 basic emotions)
  - Confidence scoring for emotion detection
  - Detailed mood tracking with intensity levels

- **Image Processing**
  - OpenCV-based image preprocessing
  - Face alignment and normalization
  - Real-time video frame processing
  - Image quality assessment

## Technical Stack

### Computer Vision & AI
- OpenCV for image processing
- DeepFace for emotion recognition
- Face detection and alignment algorithms
- Real-time video processing capabilities

### Backend
- Flask web framework
- MySQL database
- SQLAlchemy ORM
- RESTful API endpoints

### Frontend
- Modern web interface
- Real-time video feed display
- Interactive mood visualization
- Responsive design

## Prerequisites

- Python 3.x
- OpenCV (`pip install opencv-python`)
- DeepFace (`pip install deepface`)
- MySQL
- Required Python packages (install using `pip install -r requirements.txt`):
  - Flask
  - Flask-CORS
  - SQLAlchemy
  - PyMySQL
  - numpy
  - pillow

## Setup

1. Clone the repository
2. Create a MySQL database named `facialtimesheet_db`
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Initialize the database:
   ```bash
   python app.py
   ```

## Project Structure

- `app.py`: Main application file with computer vision integration
- `schema.sql`: Database schema
- `FACIALTIMESHEET/`: Application package
  - `database.py`: Database configuration
  - `models.py`: SQLAlchemy models
  - `routes.py`: API routes with computer vision endpoints
  - `auth.py`: Authentication logic with facial recognition

## Computer Vision API Endpoints

- `/api/timesheet/check-in`: 
  - Accepts video frame/image
  - Performs facial recognition
  - Analyzes employee mood
  - Records check-in time

- `/api/timesheet/check-out`:
  - Verifies employee identity
  - Records check-out time
  - Updates attendance record

## Running the Application

```bash
python app.py
```

The application will run on `http://localhost:5000` in debug mode.

## Computer Vision Features in Detail

### Face Detection
- Uses OpenCV's Haar Cascade Classifier
- Real-time face detection in video streams
- Face alignment and normalization

### Emotion Recognition
- Seven basic emotions detection:
  - Happy 😊
  - Sad 😢
  - Angry 😠
  - Surprised 😮
  - Fearful 😨
  - Disgusted 🤢
  - Neutral 😐
- Confidence scoring for each emotion
- Real-time emotion tracking

### Performance Optimization
- Optimized image processing pipeline
- Efficient face detection algorithms
- Real-time processing capabilities
- Memory-efficient video handling

## License

This project is licensed under the MIT License. 