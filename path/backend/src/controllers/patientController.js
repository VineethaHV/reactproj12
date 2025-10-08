const pool = require('../db');

exports.createPatient = async (req, res, next) => {
  try {
    const { firstName, lastName, dob, gender, contact, address, medicalHistory } = req.body;
    const result = await pool.query(
      `INSERT INTO patients (first_name, last_name, dob, gender, contact, address, medical_history, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [firstName, lastName, dob, gender, contact, address, medicalHistory, req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.getPatients = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM patients';
    let params = [];
    if (search) {
      query += ' WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR contact ILIKE $1';
      params.push(`%${search}%`);
    }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getPatient = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM patients WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Patient not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updatePatient = async (req, res, next) => {
  try {
    const { firstName, lastName, dob, gender, contact, address, medicalHistory } = req.body;
    const result = await pool.query(
      `UPDATE patients SET first_name=$1, last_name=$2, dob=$3, gender=$4, contact=$5, address=$6, medical_history=$7
       WHERE id=$8 RETURNING *`,
      [firstName, lastName, dob, gender, contact, address, medicalHistory, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Patient not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.deletePatient = async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM patients WHERE id=$1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    next(err);
  }
};