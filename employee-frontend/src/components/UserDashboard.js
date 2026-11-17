import React, { useState, useEffect } from 'react';

function UserDashboard() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data));

    fetch('http://localhost:3000/api/departments')
      .then(res => res.json())
      .then(data => setDepartments(data));
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === '' || (emp.department && emp.department._id === filterDept);
    return matchesSearch && matchesDept;
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 2, marginBottom: 0 }} />
        <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} style={{ flex: 1, marginBottom: 0 }}>
          <option value="">All Departments</option>
          {departments.map(dept => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold', color: '#555' }}>
        Total Employees: {employees.length}
      </div>

      {filteredEmployees.map(emp => (
        <div key={emp._id} className="list-item">
          <div>
            <h4>{emp.firstName} {emp.lastName} ({emp.role})</h4>
            <p>Email: {emp.email} | Dept: {emp.department ? emp.department.name : 'None'}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserDashboard;