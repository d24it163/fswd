import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/employees/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setEmployee(data);
        } else {
          setError(data.message || 'Failed to fetch employee');
        }
      } catch (err) {
        setError('Server error');
      }
    };
    fetchEmployee();
  }, [id]);

  if (error) {
    return <p style={{color:'red'}}>{error}</p>;
  }

  if (!employee) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Employee Details</h2>
      <p><strong>Name:</strong> {employee.name}</p>
      <p><strong>Email:</strong> {employee.email}</p>
      <p><strong>Phone:</strong> {employee.phone}</p>
      <p><strong>Type:</strong> {employee.employeeType}</p>
      {employee.profilePic && (
        <div>
          <strong>Profile Picture:</strong><br />
          <img src={`http://localhost:5000/uploads/${employee.profilePic}`} alt="Profile" width="150" />
        </div>
      )}
      <button onClick={() => navigate('/employees')}>Back to List</button>
    </div>
  );
}

export default EmployeeDetails;
