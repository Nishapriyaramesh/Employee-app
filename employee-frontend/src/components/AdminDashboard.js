import React, { useState, useEffect } from 'react';

function AdminDashboard({ token }) {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('');
  
  // State for creating new employee
  const [newEmp, setNewEmp] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'user', department: '' });

  // State for editing an employee
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ firstName: '', lastName: '', role: 'user', department: '' });

  const loadData = () => {
    fetch('http://localhost:3000/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data));
  };

  useEffect(() => {
    loadData();
    fetch('http://localhost:3000/api/departments')
      .then(res => res.json())
      .then(data => setDepartments(data));
  }, []);

  // --- CREATE ---
  const handleCreate = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3000/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(newEmp)
    });
    if (res.ok) {
      alert('Employee Added!');
      setNewEmp({ firstName: '', lastName: '', email: '', password: '', role: 'user', department: '' });
      loadData();
    }
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure?")) return;
    const res = await fetch(`http://localhost:3000/api/employees/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      alert('Employee Deleted!');
      loadData();
    }
  };

  // --- UPDATE ---
  const handleEditClick = (emp) => {
    setEditingId(emp._id);
    setEditFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      role: emp.role,
      department: emp.department ? emp.department._id : ''
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3000/api/employees/${editingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(editFormData)
    });
    
    if (res.ok) {
      alert('Employee Updated!');
      setEditingId(null); // Close the edit form
      loadData(); // Refresh list
    } else {
      alert('Failed to update employee.');
    }
  };

  // Filter Logic
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === '' || (emp.department && emp.department._id === filterDept);
    return matchesSearch && matchesDept;
  });

  return (
    <div>
      {/* ADD EMPLOYEE FORM */}
      <div className="item-card add-card">
        <h4>Add New Employee</h4>
        <form onSubmit={handleCreate}>
          <input type="text" placeholder="First Name" value={newEmp.firstName} onChange={e => setNewEmp({...newEmp, firstName: e.target.value})} required />
          <input type="text" placeholder="Last Name" value={newEmp.lastName} onChange={e => setNewEmp({...newEmp, lastName: e.target.value})} required />
          <input type="email" placeholder="Email" value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} required />
          <input type="password" placeholder="Password" value={newEmp.password} onChange={e => setNewEmp({...newEmp, password: e.target.value})} required />
          
          <select value={newEmp.role} onChange={e => setNewEmp({...newEmp, role: e.target.value})} required>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          
          <select value={newEmp.department} onChange={e => setNewEmp({...newEmp, department: e.target.value})} required>
            <option value="">Select Department...</option>
            {departments.map(dept => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
          </select>
          
          <button type="submit" className="create-btn">Create Employee</button>
        </form>
      </div>

      {/* SEARCH AND FILTER */}
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

      {/* EMPLOYEE LIST */}
      {filteredEmployees.map(emp => (
        <div key={emp._id} className="list-item">
          
          {/* IF EDITING THIS EMPLOYEE, SHOW THE EDIT FORM */}
          {editingId === emp._id ? (
            <form onSubmit={handleUpdate} style={{ display: 'flex', width: '100%', gap: '10px', alignItems: 'center' }}>
              <input type="text" value={editFormData.firstName} onChange={e => setEditFormData({...editFormData, firstName: e.target.value})} required style={{ marginBottom: 0 }} />
              <input type="text" value={editFormData.lastName} onChange={e => setEditFormData({...editFormData, lastName: e.target.value})} required style={{ marginBottom: 0 }} />
              <select value={editFormData.role} onChange={e => setEditFormData({...editFormData, role: e.target.value})} style={{ marginBottom: 0 }}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <select value={editFormData.department} onChange={e => setEditFormData({...editFormData, department: e.target.value})} style={{ marginBottom: 0 }}>
                <option value="">Department...</option>
                {departments.map(dept => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
              </select>
              
              <button type="submit" style={{ width: 'auto', margin: 0, backgroundColor: '#28a745' }}>Save</button>
              <button type="button" onClick={() => setEditingId(null)} style={{ width: 'auto', margin: 0, backgroundColor: '#6c757d' }}>Cancel</button>
            </form>
          ) : (
            
            /* IF NOT EDITING, SHOW THE NORMAL CARD */
            <>
              <div>
                <h4>{emp.firstName} {emp.lastName} ({emp.role})</h4>
                <p>Email: {emp.email} | Dept: {emp.department ? emp.department.name : 'None'}</p>
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEditClick(emp)} style={{ width: 'auto', margin: 0, backgroundColor: '#ffc107', color: '#000' }}>Edit</button>
                <button onClick={() => handleDelete(emp._id)} className="delete-btn">Delete</button>
              </div>
            </>
          )}

        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;