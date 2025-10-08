const pool = require('../db');

exports.createDoctor = async (req, res, next) => {
  try {
    const { name, specialization, contact, email } = req.body;
    const result = await pool.query(
      `INSERT INTO doctors (name, specialization, contact, email)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, specialization, contact, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    next(err);
  }
};

exports.getDoctors = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM doctors ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getDoctor = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM doctors WHERE id=$1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Doctor not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.updateDoctor = async (req, res, next) => {
  try {
    const { name, specialization, contact, email } = req.body;
    const result = await pool.query(
      `UPDATE doctors SET name=$1, specialization=$2, contact=$3, email=$4 WHERE id=$5 RETURNING *`,
      [name, specialization, contact, email, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Doctor not found' });
    res.json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    next(err);
  }
};

exports.deleteDoctor = async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM doctors WHERE id=$1 RETURNING id', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ message: 'Doctor deleted' });
  } catch (err) {
    next(err);
  }
};