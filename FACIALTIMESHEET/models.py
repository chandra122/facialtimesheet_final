from .database import db
from datetime import datetime

class Employee(db.Model):
    __tablename__ = 'employee'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    timesheets = db.relationship('Timesheet', backref='employee', lazy=True)

    def __repr__(self):
        return f'<Employee {self.name}>'

class Timesheet(db.Model):
    __tablename__ = 'timesheet'
    
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=False)
    check_in = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    check_out = db.Column(db.DateTime, nullable=True)
    mood = db.Column(db.String(50), nullable=True)
    entry_status = db.Column(db.String(20), nullable=True)

    def __repr__(self):
        return f'<Timesheet {self.id}>'

    def total_hours(self):
        if self.check_out:
            return (self.check_out - self.check_in).total_seconds() / 3600
        return None

class User(db.Model):
    __tablename__ = 'user'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    phone = db.Column(db.String(20), nullable=True)

    def __repr__(self):
        return f'<User {self.username}>'
