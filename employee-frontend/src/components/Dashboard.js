import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import Stats from './Stats';

function Dashboard({ token, handleLogout }) {
  const [view, setView] = useState('employees');
  const isAdmin = token && JSON.parse(atob(token.split('.')[1])).role === 'admin';

  return (
    <div className="container wide-container">
      
      <div className="header">
        <h2>
          Dashboard 
          {isAdmin && <span className="admin-badge">(Admin Mode)</span>}
        </h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="tabs">
        <button onClick={() => setView('employees')} className={view === 'employees' ? 'active' : ''}>Employees</button>
        
        {isAdmin && (
          <button onClick={() => setView('stats')} className={view === 'stats' ? 'active' : ''}>Department Stats</button>
        )}
      </div>

      {view === 'employees' ? (
        isAdmin ? (
          <AdminDashboard token={token} />
        ) : (
          <UserDashboard />
        )
      ) : (
        isAdmin && <Stats />
      )}
    </div>
  );
}

export default Dashboard;