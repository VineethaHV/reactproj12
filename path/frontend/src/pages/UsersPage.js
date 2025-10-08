import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';

const UsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(null);

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleEdit = (u) => setForm({ ...u, _id: u._id });
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`);
    fetchUsers();
  };

  const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFormSubmit = async e => {
    e.preventDefault();
    await api.put(`/users/${form._id}`, form);
    setForm(null);
    fetchUsers();
  };

  return (
    <div className="container">
      <h2>Users</h2>
      {user?.role === 'admin' && (
        <button onClick={() => setForm({ name: '', username: '', role: 'staff' })}>Add User</button>
      )}
      {form && (
        <form onSubmit={handleFormSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleFormChange} required />
          <input name="username" placeholder="Username" value={form.username} onChange={handleFormChange} required />
          <select name="role" value={form.role} onChange={handleFormChange}>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Save</button>
          <button type="button" onClick={() => setForm(null)}>Cancel</button>
        </form>
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Username</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;