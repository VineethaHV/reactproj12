import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';

const AppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState(null);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments', { params: { clientName: search } });
      setAppointments(res.data);
    } catch (err) {
      setError('Failed to fetch appointments');
    }
  };

  useEffect(() => { fetchAppointments(); }, [search]);

  const handleEdit = (appt) => setForm({
    ...appt,
    _id: appt._id
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    await api.delete(`/appointments/${id}`);
    fetchAppointments();
  };

  const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFormSubmit = async e => {
    e.preventDefault();
    if (form._id) {
      await api.put(`/appointments/${form._id}`, form);
    } else {
      await api.post('/appointments', form);
    }
    setForm(null);
    fetchAppointments();
  };

  return (
    <div className="container">
      <h2>Appointments</h2>
      <input placeholder="Search by client name..." value={search} onChange={e => setSearch(e.target.value)} />
      <button onClick={() => setForm({ title: '', description: '', date: '', duration: 30, status: 'Scheduled', clientName: '', clientContact: '' })}>Add Appointment</button>
      {form && (
        <form onSubmit={handleFormSubmit}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleFormChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleFormChange} />
          <input name="date" type="datetime-local" value={form.date?.slice(0,16) || ''} onChange={handleFormChange} required />
          <input name="duration" type="number" min="1" placeholder="Duration (minutes)" value={form.duration} onChange={handleFormChange} required />
          <select name="status" value={form.status} onChange={handleFormChange}>
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <input name="clientName" placeholder="Client Name" value={form.clientName} onChange={handleFormChange} required />
          <input name="clientContact" placeholder="Client Contact" value={form.clientContact} onChange={handleFormChange} required />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setForm(null)}>Cancel</button>
        </form>
      )}
      <table>
        <thead>
          <tr>
            <th>Title</th><th>Date</th><th>Duration</th><th>Status</th><th>Client</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a._id}>
              <td>{a.title}</td>
              <td>{a.date?.slice(0,16).replace('T', ' ')}</td>
              <td>{a.duration} min</td>
              <td>{a.status}</td>
              <td>{a.clientName} ({a.clientContact})</td>
              <td>
                <button onClick={() => handleEdit(a)}>Edit</button>
                <button onClick={() => handleDelete(a._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default AppointmentsPage;