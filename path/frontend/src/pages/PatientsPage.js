import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients', { params: { search } });
      setPatients(res.data);
    } catch (err) {
      setError('Failed to fetch patients');
    }
  };

  useEffect(() => { fetchPatients(); }, [search]);

  const handleEdit = (patient) => setForm({
    ...patient,
    firstName: patient.first_name,
    lastName: patient.last_name,
    dob: patient.dob,
    gender: patient.gender,
    contact: patient.contact,
    address: patient.address,
    medicalHistory: patient.medical_history,
    _id: patient.id
  });
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient?')) return;
    await api.delete(`/patients/${id}`);
    fetchPatients();
  };

  const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFormSubmit = async e => {
    e.preventDefault();
    if (form._id) {
      await api.put(`/patients/${form._id}`, form);
    } else {
      await api.post('/patients', form);
    }
    setForm(null);
    fetchPatients();
  };

  return (
    <div className="container">
      <h2>Patients</h2>
      <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
      <button onClick={() => setForm({ firstName: '', lastName: '', dob: '', gender: '', contact: '', address: '', medicalHistory: '' })}>Add Patient</button>
      {form && (
        <form onSubmit={handleFormSubmit}>
          <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleFormChange} required />
          <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleFormChange} required />
          <input name="dob" type="date" placeholder="DOB" value={form.dob?.slice(0,10) || ''} onChange={handleFormChange} required />
          <select name="gender" value={form.gender} onChange={handleFormChange} required>
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input name="contact" placeholder="Contact" value={form.contact} onChange={handleFormChange} required />
          <input name="address" placeholder="Address" value={form.address} onChange={handleFormChange} />
          <input name="medicalHistory" placeholder="Medical History" value={form.medicalHistory} onChange={handleFormChange} />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setForm(null)}>Cancel</button>
        </form>
      )}
      <table>
        <thead>
          <tr>
            <th>Name</th><th>DOB</th><th>Gender</th><th>Contact</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id}>
              <td>{p.first_name} {p.last_name}</td>
              <td>{p.dob?.slice(0,10)}</td>
              <td>{p.gender}</td>
              <td>{p.contact}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default PatientsPage;