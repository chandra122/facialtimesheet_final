from flask import Flask
from flask_cors import CORS
from FACIALTIMESHEET.database import db
from FACIALTIMESHEET.routes import api_bp, auth
from FACIALTIMESHEET.models import Employee, Timesheet
from sqlalchemy import inspect, text
import os

app = Flask(__name__)
CORS(app)

# I set up the database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/facialtimesheet_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# I initialize the database extension
db.init_app(app)

# I register the API and authentication blueprints
app.register_blueprint(api_bp, url_prefix='/api')
app.register_blueprint(auth, url_prefix='/api')

def print_table_schema(inspector, table_name):
    columns = inspector.get_columns(table_name)
    print(f"\nSchema for table '{table_name}':")
    for column in columns:
        print(f"- {column['name']}: {column['type']}")

def init_db():
    # I read and execute the SQL schema file
    with open('schema.sql', 'r') as f:
        sql_commands = f.read()
    
    # I execute each SQL command
    with db.engine.connect() as conn:
        for command in sql_commands.split(';'):
            if command.strip():
                conn.execute(text(command))
                conn.commit()

if __name__ == '__main__':
    with app.app_context():
        print("Initializing database...")
        init_db()
        
        print("Creating test employee...")
        test_employee = Employee(name="Test User")
        db.session.add(test_employee)
        db.session.commit()
        
        # I verify the database schema
        inspector = inspect(db.engine)
        for table_name in inspector.get_table_names():
            print_table_schema(inspector, table_name)
        
        # I verify the test employee creation
        employee = Employee.query.first()
        print(f"Test employee created: {employee}")
        
        print("Database setup complete!")
        
        # I create all tables defined in my models
        db.create_all()
        
    app.run(debug=True)
