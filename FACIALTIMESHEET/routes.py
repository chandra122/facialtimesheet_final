from flask import Blueprint, request, jsonify
from .models import Employee, Timesheet, User
from .database import db
from datetime import datetime
import cv2
import numpy as np
from deepface import DeepFace
import base64
import io
from PIL import Image
from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash
import bcrypt

api_bp = Blueprint('api', __name__)
auth = Blueprint('auth', __name__)

@api_bp.route('/employees', methods=['POST'])
def add_employee():
    data = request.json
    new_employee = Employee(name=data['name'])
    db.session.add(new_employee)
    db.session.commit()
    return jsonify({"message": "Employee added", "id": new_employee.id}), 201

@api_bp.route('/timesheet/check-in', methods=['POST'])
def check_in():
    try:
        print("Starting check-in process...")
        if 'image' not in request.files:
            return jsonify({"error": "No image provided"}), 400

        file = request.files['image']
        print(f"Received image file: {file.filename}")
        
        # Test employee was retrieved for facial recognition
        employee = Employee.query.first()
        if not employee:
            return jsonify({"error": "No employee found"}), 404

        # File was converted to OpenCV compatible format
        in_memory_file = io.BytesIO()
        file.save(in_memory_file)
        in_memory_file.seek(0)
        file_bytes = np.asarray(bytearray(in_memory_file.read()), dtype=np.uint8)
        img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

        try:
            # Mood was analyzed using DeepFace with detailed results
            analysis = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
            emotions = analysis[0]['emotion']
            
            # Dominant emotion and probability were determined
            dominant_emotion = max(emotions.items(), key=lambda x: x[1])
            detected_mood = dominant_emotion[0]
            confidence = dominant_emotion[1]
            
            # Top 3 emotions were extracted for context
            sorted_emotions = sorted(emotions.items(), key=lambda x: x[1], reverse=True)[:3]
            
            print("Detected emotions:", sorted_emotions)
            
            # Mood descriptions were defined with emojis
            mood_descriptions = {
                'angry': 'Very Angry 😠',
                'disgust': 'Disgusted 🤢',
                'fear': 'Fearful 😨',
                'happy': 'Happy 😊',
                'sad': 'Sad 😢',
                'surprise': 'Surprised 😮',
                'neutral': 'Neutral 😐'
            }
            
            display_mood = mood_descriptions.get(detected_mood, detected_mood)
            
            # Intensity level was added based on confidence
            if confidence > 90:
                intensity = "very "
            elif confidence > 70:
                intensity = "quite "
            elif confidence > 50:
                intensity = "somewhat "
            else:
                intensity = "slightly "
            
            detailed_mood = f"{intensity}{display_mood}"

        except Exception as e:
            print(f"DeepFace error: {str(e)}")
            detailed_mood = "Mood Unclear 🤔"
            detected_mood = "unknown"

        # Timesheet record was inserted using raw SQL
        current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        sql = text("""
            INSERT INTO timesheet 
            (employee_id, check_in, mood, entry_status) 
            VALUES 
            (:employee_id, :check_in, :mood, :entry_status)
        """)
        
        result = db.session.execute(sql, {
            'employee_id': employee.id,
            'check_in': current_time,
            'mood': detailed_mood,
            'entry_status': 'Checked In'
        })
        
        db.session.commit()
        
        return jsonify({
            "message": "Check-in recorded successfully",
            "mood": detailed_mood,
            "mood_details": {
                "dominant": detected_mood,
                "confidence": confidence,
                "top_emotions": [
                    {
                        "emotion": emotion,
                        "probability": f"{prob:.2f}%"
                    } for emotion, prob in sorted_emotions
                ]
            },
            "timesheet_id": result.lastrowid
        }), 201

    except Exception as e:
        print(f"Error in check_in: {str(e)}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@api_bp.route('/timesheet', methods=['GET'])
def get_timesheet():
    try:
        # Timesheet data was queried using raw SQL
        sql = text("""
            SELECT id, employee_id, check_in, check_out, mood, entry_status 
            FROM timesheet 
            ORDER BY check_in DESC
        """)
        
        result = db.session.execute(sql)
        timesheet_data = []
        
        for row in result:
            timesheet_data.append({
                'id': row.id,
                'date': row.check_in.strftime('%Y-%m-%d'),
                'checkIn': row.check_in.strftime('%H:%M'),
                'checkOut': row.check_out.strftime('%H:%M') if row.check_out else None,
                'status': row.entry_status,
                'mood': row.mood
            })
            
        return jsonify(timesheet_data)
    except Exception as e:
        print(f"Error in get_timesheet: {str(e)}")
        return jsonify({'error': str(e)}), 500

@api_bp.route('/timesheet/check-out', methods=['POST'])
def check_out():
    try:
        print("Starting check-out process...")
        
        # Most recent active timesheet entry was found
        timesheet = Timesheet.query.filter_by(
            check_out=None
        ).order_by(Timesheet.check_in.desc()).first()

        if not timesheet:
            return jsonify({"error": "No active check-in found"}), 404

        # Check-out time and status were updated
        current_time = datetime.now()
        timesheet.check_out = current_time
        timesheet.entry_status = 'Checked Out'
        
        # Changes were committed to the database
        db.session.commit()

        return jsonify({
            "message": "Check-out successful",
            "check_out_time": current_time.strftime("%H:%M")
        }), 200

    except Exception as e:
        print(f"Error during check-out: {str(e)}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@api_bp.route('/')
def index():
    return jsonify({"message": "API is working"})

@api_bp.route('/test-db', methods=['GET'])
def test_db():
    try:
        employees = Employee.query.all()
        timesheets = Timesheet.query.all()
        
        return jsonify({
            "status": "success",
            "message": "Database connection successful",
            "data": {
                "employee_count": len(employees),
                "employees": [{
                    "id": emp.id,
                    "name": emp.name
                } for emp in employees],
                "timesheet_count": len(timesheets),
                "timesheets": [{
                    "id": ts.id,
                    "employee_id": ts.employee_id,
                    "check_in": ts.check_in.strftime("%Y-%m-%d %H:%M:%S"),
                    "mood": ts.mood,
                    "status": ts.entry_status
                } for ts in timesheets]
            }
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Database error: {str(e)}"
        }), 500

@auth.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())

    new_user = User(
        username=data['username'],
        email=data['email'],
        password=hashed_password,
        first_name=data['firstName'],
        last_name=data['lastName'],
        phone=data.get('phone')  # Optional field
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error during user creation: {str(e)}")
        return jsonify({'error': str(e)}), 500

@auth.route('/signin', methods=['POST'])
def signin():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if not user or not bcrypt.checkpw(data['password'].encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({"error": "Invalid credentials"}), 401
    return jsonify({"message": "Login successful"}), 200
