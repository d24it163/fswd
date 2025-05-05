import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchEmployees = async (query = '') => {
    setError('');
    try {
      let url = 'http://localhost:5000/api/employees';
      if (query) {
        url = `http://localhost:5000/api/employees/search/${query}`;
      }
      const token = localStorage.getItem('token');
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setEmployees(data);
      } else {
        setError(data.message || 'Failed to fetch employees');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchEmployees(search);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to delete employee');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div>
      <h2>Employee List</h2>
      <button onClick={() => navigate('/employees/new')}>Add New Employee</button>
      <form onSubmit={handleSearch} style={{ marginTop: '10px' }}>
        <input
          type="text"
          placeholder="Search employees by name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {error && <p style={{color:'red'}}>{error}</p>}
      <table border="1" cellPadding="5" cellSpacing="0" style={{ marginTop: '10px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 && (
            <tr>
              <td colSpan="5">No employees found</td>
            </tr>
          )}
          {employees.map(emp => (
            <tr key={emp._id}>
              <td><Link to={`/employees/${emp._id}`}>{emp.name}</Link></td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>{emp.employeeType}</td>
              <td>
                <button onClick={() => navigate(`/employees/edit/${emp._id}`)}>Edit</button>
                <button onClick={() => handleDelete(emp._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeList;
