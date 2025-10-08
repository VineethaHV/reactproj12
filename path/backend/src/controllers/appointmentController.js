const pool = require('../db');

exports.createAppointment = async (req, res, next) => {
  try {
    const { patient, doctor, date, reason, status, notes } = req.body;
    const result = await pool.query(
      `INSERT INTO appointments (patient_id, doctor_id, date, reason, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [patient, doctor, date, reason, status || 'Scheduled', notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.getAppointments = async (req, res, next) => {
  try {
    const { patient, doctor, status } = req.query;
    let query = `
      SELECT a.*, 
        p.first_name AS patient_first_name, p.last_name AS patient_last_name,
        d.name AS doctor_name, d.specialization AS doctor_specialization
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
    `;
    let params = [];
    let where = [];
    if (patient) { params.push(patient); where.push(`a.patient_id = $${params.length}`); }
    if (doctor) { params.push(doctor); where.push(`a.doctor_id = $${params.length}`); }
    if (status) { params.push(status); where.push(`a.status = $${params.length}`); }
    if (where.length) query += ' WHERE ' + where.join(' AND ');
    query += ' ORDER BY a.date DESC';
    const result = await pool.query(query, params);
    res.json(result.rows.map(a => ({
      ...a,
      patient: { firstName: a.patient_first_name, lastName: a.patient_last_name },
      doctor: { name: a.doctor_name, specialization: a.doctor_specialization }
    })));
  } catch (err) {
    next(err);
  }
};

exports.getAppointment = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT a.*, 
        p.first_name AS patient_first_name, p.last_name AS patient_last_name,
        d.name AS doctor_name, d.specialization AS doctor_specialization
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id=$1`, [req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Appointment not found' });
    const a = result.rows[0];
    res.json({
      ...a,
      patient: { firstName: a.patient_first_name, lastName: a.patient_last_name },
      doctor: { name: a.doctor_name, specialization: a.doctor_specialization }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const { patient, doctor, date, reason, status, notes } = req.body;
    const result = await pool.query(
      `UPDATE appointments SET patient_id=$1, doctor_id=$2, date=$3, reason=$4, status=$5, notes=$6 WHERE id=$7 RETURNING *`,
      [patient, doctor, date, reason, status, notes, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Appointment not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM appointments WHERE id=$1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    next(err);
  }
};