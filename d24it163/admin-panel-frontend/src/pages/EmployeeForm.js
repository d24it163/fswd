import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EmployeeForm({ editMode }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [employeeType, setEmployeeType] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (editMode && id) {
      const fetchEmployee = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`http://localhost:5000/api/employees/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (res.ok) {
            setName(data.name);
            setEmail(data.email);
            setPhone(data.phone);
            setEmployeeType(data.employeeType);
          } else {
            setError(data.message || 'Failed to fetch employee');
          }
        } catch (err) {
          setError('Server error');
        }
      };
      fetchEmployee();
    }
  }, [editMode, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('employeeType', employeeType);
      if (profilePic) {
        formData.append('profilePic', profilePic);
      }

      const url = editMode ? `http://localhost:5000/api/employees/${id}` : 'http://localhost:5000/api/employees';
      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        navigate('/employees');
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to save employee');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div>
      <h2>{editMode ? 'Edit Employee' : 'Add New Employee'}</h2>
      {error && <p style={{color:'red'}}>{error}</p>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Name:</label><br />
          <input type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label><br />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Phone:</label><br />
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div>
          <label>Employee Type:</label><br />
          <input type="text" value={employeeType} onChange={e => setEmployeeType(e.target.value)} required />
        </div>
        <div>
          <label>Profile Picture:</label><br />
          <input type="file" onChange={e => setProfilePic(e.target.files[0])} accept="image/*" />
        </div>
        <button type="submit">{editMode ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}

export default EmployeeForm;
