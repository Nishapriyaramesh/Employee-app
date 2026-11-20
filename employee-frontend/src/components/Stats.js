import React, { useState, useEffect } from 'react';

function Stats() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/employees/stats')
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <div key={index} className="item-card stat-card">
          <h4>{stat.departmentName || "Unknown Department"}</h4>
          <p>{stat.totalEmployees}</p>
          <span className="stat-label">Employees</span>
        </div>
      ))}
    </div>
  );
}

export default Stats;