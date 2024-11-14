from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import traceback

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize face recognition
from models.face_recognition import FaceRecognition
face_recognition = FaceRecognition()

class AttendanceCapture(BaseModel):
    image: str

class AttendanceRecord(BaseModel):
    student_id: str
    name: str
    date: str
    time: str
    status: str
    confidence: Optional[float] = None

@app.get("/api/attendance")
async def get_attendance():
    try:
        # Get attendance records from face recognition system
        records = face_recognition.attendance_records
        
        if records is None:
            records = []
            
        # Sort records by date and time (most recent first)
        records.sort(key=lambda x: f"{x['date']} {x['time']}", reverse=True)
        
        return {
            "success": True,
            "data": records
        }
    except Exception as e:
        print("Error getting attendance records:")
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to get attendance records: {str(e)}"
        )

@app.post("/api/mark-attendance")
async def mark_attendance(capture: AttendanceCapture):
    try:
        if not capture.image:
            raise HTTPException(status_code=400, detail="No image provided")
            
        result = face_recognition.mark_attendance(capture.image)
        
        return {
            "success": True,
            "message": "Attendance processed",
            "data": result
        }
        
    except Exception as e:
        print("Error marking attendance:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

class StudentRegistration(BaseModel):
    student_id: str
    name: str
    images: List[str]

@app.post("/api/register-student")
async def register_student(data: StudentRegistration):
    try:
        if not data.student_id or not data.name or not data.images:
            raise HTTPException(
                status_code=400, 
                detail="Missing required registration data"
            )
            
        success = face_recognition.register_student(
            data.student_id,
            data.name,
            data.images
        )
        
        if success:
            return {
                "success": True,
                "message": "Student registered successfully"
            }
        else:
            raise HTTPException(
                status_code=500,
                detail="Failed to register student"
            )
            
    except Exception as e:
        print("Error registering student:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/students")
async def get_students():
    try:
        return {
            "success": True,
            "data": face_recognition.students
        }
    except Exception as e:
        print("Error getting students:")
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get students: {str(e)}"
        )

@app.get("/api/dashboard-stats")
async def get_dashboard_stats():
    try:
        # Get current date
        today = datetime.now().strftime('%Y-%m-%d')
        
        # Calculate stats
        total_students = len(face_recognition.students)
        today_attendance = len([
            record for record in face_recognition.attendance_records 
            if record['date'] == today
        ])
        
        # Calculate attendance rate
        attendance_rate = (today_attendance / total_students * 100) if total_students > 0 else 0
        
        # Get last 7 days data
        last_7_days = []
        for i in range(7):
            date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
            count = len([
                record for record in face_recognition.attendance_records 
                if record['date'] == date
            ])
            last_7_days.append({
                'date': date,
                'count': count
            })
        
        # Get recent activity
        recent_activity = sorted(
            face_recognition.attendance_records,
            key=lambda x: f"{x['date']} {x['time']}",
            reverse=True
        )[:5]

        return {
            "success": True,
            "data": {
                "totalStudents": total_students,
                "todayAttendance": today_attendance,
                "attendanceRate": round(attendance_rate, 1),
                "last7Days": last_7_days,
                "recentActivity": recent_activity
            }
        }
    except Exception as e:
        print(f"Error getting dashboard stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
