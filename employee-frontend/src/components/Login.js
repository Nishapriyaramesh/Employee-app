import React, { useState, useEffect } from 'react';

function Login({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('password123');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('user');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/departments')
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.log(err));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
    } else {
      alert(data.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, email, password, role, department })
    });
    const data = await res.json();
    if (res.ok) {
      alert('Registration successful! Please login.');
      setIsLogin(true);
    } else {
      alert(data.message || data.error);
    }
  };

  return (
    <div>
      <h2>{isLogin ? 'Login to Dashboard' : 'Create an Account'}</h2>
      <form onSubmit={isLogin ? handleLogin : handleRegister}>
        {!isLogin && (
          <>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <select value={department} onChange={(e) => setDepartment(e.target.value)} required>
              <option value="">Select Department...</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
          </>
        )}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <p className="toggle-text">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'Register here' : 'Login here'}</span>
      </p>
    </div>
  );
}

export default Login;