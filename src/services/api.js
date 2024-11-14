const API_BASE_URL = 'http://localhost:8000/api';

export const registerStudent = async (studentData) => {
  try {
    console.log('Registering student:', studentData);
    const response = await fetch(`${API_BASE_URL}/register-student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id: studentData.id,
        name: studentData.name,
        images: studentData.images
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering student:', error);
    throw error;
  }
};

export const markAttendance = async (imageData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/mark-attendance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageData
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error marking attendance:', error);
    throw error;
  }
};

export const getAttendance = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch attendance records');
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || []
    };
  } catch (error) {
    console.error('Error fetching attendance:', error);
    throw error;
  }
};

export const getStudents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/students`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard-stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const getSettings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`);
    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch settings');
  }
};

export const updateSettings = async (settings) => {
  try {
    const response = await fetch(`${API_BASE_URL}/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    return await response.json();
  } catch (error) {
    throw new Error('Failed to update settings');
  }
};
