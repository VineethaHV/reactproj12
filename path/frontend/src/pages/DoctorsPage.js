import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import useAuth from '../hooks/useAuth';

const DoctorsPage = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(null);

  const fetchDoctors = async () => {
    const res = await api.get('/doctors');
    setDoctors(res.data);
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleEdit = (doctor) => setForm({
    ...doctor,
    _id: doctor.id
  });
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor?')) return;
    await api.delete(`/doctors/${id}`);
    fetchDoctors();
  };

  const handleFormChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFormSubmit = async e => {
    e.preventDefault();
    if (form._id) {
      await api.put(`/doctors/${form._id}`, form);
    } else {
      await api.post('/doctors', form);
    }
    setForm(null);
    fetchDoctors();
  };

  return (
    <div className="container">
      <h2>Doctors</h2>
      {user?.role === 'admin' && (
        <button onClick={() => setForm({ name