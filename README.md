# Facial TimeSheet

A Flask-based web application for employee time tracking with facial recognition capabilities.

## Features

- Employee management
- Time tracking with check-in/check-out functionality
- Mood tracking
- Facial recognition for authentication
- RESTful API endpoints

## Prerequisites

- Python 3.x
- MySQL
- Required Python packages (install using `pip install -r requirements.txt`):
  - Flask
  - Flask-CORS
  - SQLAlchemy
  - PyMySQL
  - face_recognition

## Setup

1. Clone the repository
2. Create a MySQL database named `facialtimesheet_db`
3. Update the database configuration in `app.py` if needed
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Initialize the database:
   ```bash
   python app.py
   ```

## Project Structure

- `app.py`: Main application file
- `schema.sql`: Database schema
- `FACIALTIMESHEET/`: Application package
  - `database.py`: Database configuration
  - `models.py`: SQLAlchemy models
  - `routes.py`: API routes
  - `auth.py`: Authentication logic

## API Endpoints

- `/api/employees`: Employee management
- `/api/timesheets`: Timesheet operations
- `/api/auth`: Authentication endpoints

## Running the Application

```bash
python app.py
```

The application will run on `http://localhost:5000` in debug mode.

## License

This project is licensed under the MIT License. 