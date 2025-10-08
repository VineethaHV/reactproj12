import React from 'react';
import useAuth from '../hooks/useAuth';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <p>Welcome, {user?.name} ({user?.role})</p>
      <button onClick={logout}>Logout</button>
      <ul>
        <li><a href="/appointments">Appointments</a></li>
        {user?.role === 'admin' && <li><a href="/users">Users</a></li>}
      </ul>
    </div>
  );
};

export default DashboardPage;