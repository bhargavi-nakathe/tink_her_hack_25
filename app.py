from flask import Flask, request, jsonify  # Import Flask, request, and jsonify
import sqlite3  # Import sqlite3 for database operations
from flask_cors import CORS,cross_origin


app = Flask(__name__)  # Create a Flask app instance
#CORS(app,allow_headers=['*'])
CORS(app,allow_headers=['*'], resources={r"/*": {"origins": "*"}})  # Allow CORS for all routes



# Helper function to connect to the database
def get_db():
    conn = sqlite3.connect('expense_tracker.db')  # Connect to the SQLite database
    return conn

# Create tables
def create_tables():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        ''')
        conn.commit()  # Save changes to the database

# Register Route
@app.route('/register', methods=['POST'])
def register():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS Preflight Handled'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        return response, 200
    data = request.get_json()  # Get JSON data from the request
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
            conn.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username already exists'}), 400

# Run the app
if __name__ == '__main__':
    create_tables()  # Create tables if they don't exist
    app.run(debug=True,port=8000,host='0.0.0.0')  # Start the Flask app in debug mode