import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(null);

  const fetchData = async () => {
    const [a, p, d] = await Promise.all([
      api.get('/appointments'),
      api.get('/patients'),
      api.get('/doctors')
    ]);
    setAppointments(a.data);
    setPatients(p.data);
    setDoctors(d.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = (appt) => setForm({
    ...appt,
    patient: appt.patient_id || appt.patient?.id,
    doctor: appt.doctor_id || appt.doctor?.id,
    date: appt.date,
    reason: appt.reason,
    status: appt.status,
    notes: appt.notes,
    _id: appt.id
  });
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    await api.delete(`/appointments/${id}`);
    fetchData();
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
    fetchData();
  };

  return (
    <div className="container">
      <h2>Appointments</h2>
      <button onClick={() => setForm({ patient: '', doctor: '', date: '', reason: '', status: 'Scheduled', notes: '' })}>Add Appointment</button>
      {form && (
        <form onSubmit={handleFormSubmit}>
          <select name="patient" value={form.patient} onChange={handleFormChange} required>
            <option value="">Select Patient</option>
            {patients.map(p => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
          </select>
          <select name="doctor" value={form.doctor} onChange={handleFormChange} required>
            <option value="">Select Doctor</option>
            {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialization})</option>)}
          </select>
          <input name="date" type="datetime-local" value={form.date?.slice(0,16) || ''} onChange={handleFormChange} required />
          <input name="reason" placeholder="Reason" value={form.reason} onChange={handleFormChange} />
          <select name="status" value={form.status} onChange={handleFormChange}>
            <option>Scheduled</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <input name="notes" placeholder="Notes" value={form.notes} onChange={handleFormChange} />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setForm(null)}>Cancel</button>
        </form>
      )}
      <table>
        <thead>
          <tr>
            <th>Patient</th><th>Doctor</th><th>Date</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(a => (
            <tr key={a.id}>
              <td>{a.patient?.firstName || a.patient_first_name} {a.patient?.lastName || a.patient_last_name}</td>
              <td>{a.doctor?.name || a.doctor_name}</td>
              <td>{a.date?.slice(0,16).replace('T', ' ')}</td>
              <td>{a.status}</td>
              <td>
                <button onClick={() => handleEdit(a)}>Edit</button>
                <button onClick={() => handleDelete(a.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsPage;