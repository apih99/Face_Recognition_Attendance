import cv2
import numpy as np
import base64
import os
import json
from datetime import datetime
import traceback

class FaceRecognition:
    def __init__(self):
        # Load face detection cascade
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        # Initialize face recognizer
        self.recognizer = cv2.face.LBPHFaceRecognizer_create(
            radius=2,
            neighbors=8,
            grid_x=8,
            grid_y=8,
            threshold=100.0
        )
        
        # Initialize data storage
        self.students = {}
        self.attendance_records = []
        
        # Create data directory if it doesn't exist
        os.makedirs('data', exist_ok=True)
        
        # Load existing data
        self.load_data()

    def mark_attendance(self, image_base64):
        try:
            print("\n=== Starting face recognition process ===")
            
            # Decode image
            base64_data = image_base64.split(',')[1]
            img_data = base64.b64decode(base64_data)
            nparr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                print("Failed to decode image")
                return None
                
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Enhance image
            gray = cv2.equalizeHist(gray)
            
            # Detect faces
            faces = self.face_cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=3,
                minSize=(30, 30)
            )
            
            print(f"Detected {len(faces)} faces")
            
            # Save debug image
            debug_path = 'debug_images'
            os.makedirs(debug_path, exist_ok=True)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            
            # Draw rectangles around detected faces
            debug_img = img.copy()
            for (x, y, w, h) in faces:
                cv2.rectangle(debug_img, (x, y), (x+w, y+h), (0, 255, 0), 2)
            cv2.imwrite(f'{debug_path}/detected_{timestamp}.jpg', debug_img)
            
            attendance_records = []
            
            for (x, y, w, h) in faces:
                try:
                    # Extract and preprocess face
                    face = gray[y:y+h, x:x+w]
                    face = cv2.resize(face, (200, 200))
                    
                    # Save individual face for debugging
                    cv2.imwrite(f'{debug_path}/face_{timestamp}.jpg', face)
                    
                    # Get prediction with much higher threshold
                    student_id, confidence = self.recognizer.predict(face)
                    print(f"Raw prediction - Student ID: {student_id}, Confidence: {confidence}")
                    
                    # Use a very high threshold for testing
                    if confidence < 1000:  # Increased significantly for testing
                        student = self.students.get(str(student_id))
                        if student:
                            print(f"Found matching student: {student['name']}")
                            now = datetime.now()
                            attendance = {
                                'student_id': str(student_id),
                                'name': student['name'],
                                'date': now.strftime('%Y-%m-%d'),
                                'time': now.strftime('%H:%M'),
                                'status': 'Present',
                                'confidence': float(confidence)
                            }
                            
                            # Check for recent duplicate
                            recent_record = next(
                                (record for record in self.attendance_records 
                                 if record['student_id'] == str(student_id) 
                                 and (datetime.now() - datetime.strptime(f"{record['date']} {record['time']}", '%Y-%m-%d %H:%M')).seconds < 60),
                                None
                            )
                            
                            if not recent_record:
                                self.attendance_records.append(attendance)
                                attendance_records.append(attendance)
                                print(f"Marked attendance for {student['name']}")
                                self.save_data()
                            else:
                                print(f"Skipped duplicate mark for {student['name']}")
                        else:
                            print(f"No student found with ID: {student_id}")
                    else:
                        print(f"Confidence too low: {confidence}")
                        
                except Exception as e:
                    print(f"Error processing face: {str(e)}")
                    traceback.print_exc()
                    continue
            
            if not attendance_records:
                print("No faces recognized with sufficient confidence")
                
            return attendance_records
            
        except Exception as e:
            print(f"Error in mark_attendance: {str(e)}")
            traceback.print_exc()
            return None

    def register_student(self, student_id, name, images):
        try:
            print(f"\n=== Registering student {name} (ID: {student_id}) ===")
            
            student_dir = f'data/students/{student_id}'
            os.makedirs(student_dir, exist_ok=True)
            
            faces = []
            saved_images = []
            
            for idx, img_base64 in enumerate(images):
                try:
                    # Convert base64 to image
                    img_data = base64.b64decode(img_base64.split(',')[1])
                    nparr = np.frombuffer(img_data, np.uint8)
                    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
                    
                    # Convert to grayscale
                    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                    gray = cv2.equalizeHist(gray)
                    
                    # Detect face
                    faces_rect = self.face_cascade.detectMultiScale(
                        gray,
                        scaleFactor=1.1,
                        minNeighbors=3,
                        minSize=(30, 30)
                    )
                    
                    if len(faces_rect) >= 1:
                        (x, y, w, h) = faces_rect[0]
                        face = gray[y:y+h, x:x+w]
                        face = cv2.resize(face, (200, 200))
                        
                        # Create multiple variations of each face
                        variations = [
                            face,  # Original
                            cv2.flip(face, 1),  # Horizontal flip
                            cv2.add(face, np.random.normal(0, 10, face.shape).astype(np.uint8)),  # Add noise
                            cv2.add(face, -20),  # Darker
                            cv2.add(face, 20),   # Lighter
                            cv2.GaussianBlur(face, (3, 3), 0),  # Slightly blurred
                        ]
                        
                        faces.extend(variations)
                        
                        # Save original face
                        face_path = f'{student_dir}/face_{idx}.jpg'
                        cv2.imwrite(face_path, face)
                        saved_images.append(face_path)
                        print(f"Saved face image: {face_path}")
                        
                except Exception as e:
                    print(f"Error processing image {idx}: {str(e)}")
                    continue
            
            if not faces:
                raise ValueError("No valid face images detected")
            
            # Create labels for all variations
            labels = [int(student_id)] * len(faces)
            
            # Train the recognizer
            print(f"Training with {len(faces)} face variations")
            self.recognizer.train(faces, np.array(labels))
            
            # Save the trained model
            self.recognizer.write('data/trainer.yml')
            
            # Save student info
            self.students[student_id] = {
                'name': name,
                'registration_date': datetime.now().strftime('%Y-%m-%d'),
                'face_images': saved_images
            }
            
            self.save_data()
            print(f"Successfully registered student {name}")
            return True
            
        except Exception as e:
            print(f"Error registering student: {str(e)}")
            traceback.print_exc()
            return False

    def load_data(self):
        try:
            # Load students data
            if os.path.exists('data/students.json'):
                with open('data/students.json', 'r') as f:
                    self.students = json.load(f)
            
            # Load attendance records
            if os.path.exists('data/attendance.json'):
                with open('data/attendance.json', 'r') as f:
                    self.attendance_records = json.load(f)
            
            # Load recognizer if training data exists
            if os.path.exists('data/trainer.yml'):
                try:
                    self.recognizer.read('data/trainer.yml')
                    print("Loaded existing training data")
                except Exception as e:
                    print(f"Error loading training data: {e}")
                
        except Exception as e:
            print(f"Error loading data: {e}")
            # Initialize empty data if loading fails
            self.students = {}
            self.attendance_records = []

    def save_data(self):
        try:
            # Save students data
            os.makedirs('data', exist_ok=True)
            with open('data/students.json', 'w') as f:
                json.dump(self.students, f, indent=2)
            
            # Save attendance records
            with open('data/attendance.json', 'w') as f:
                json.dump(self.attendance_records, f, indent=2)
                
            # Save recognizer
            self.recognizer.write('data/trainer.yml')
            
        except Exception as e:
            print(f"Error saving data: {str(e)}")
