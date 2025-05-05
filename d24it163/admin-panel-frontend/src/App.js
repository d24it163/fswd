import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import EmployeeList from './pages/EmployeeList';
import EmployeeForm from './pages/EmployeeForm';
import EmployeeDetails from './pages/EmployeeDetails';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/employees" /> : <Login />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/employees" /> : <Register />} />
        <Route path="/employees" element={isLoggedIn ? <EmployeeList /> : <Navigate to="/login" />} />
        <Route path="/employees/new" element={isLoggedIn ? <EmployeeForm /> : <Navigate to="/login" />} />
        <Route path="/employees/:id" element={isLoggedIn ? <EmployeeDetails /> : <Navigate to="/login" />} />
        <Route path="/employees/edit/:id" element={isLoggedIn ? <EmployeeForm editMode={true} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/employees" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
