require('dotenv').config();
const pool = require('./db');

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'receptionist',
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS doctors (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      specialization VARCHAR(100) NOT NULL,
      contact VARCHAR(100),
      email VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      dob DATE NOT NULL,
      gender VARCHAR(10) NOT NULL,
      contact VARCHAR(100) NOT NULL,
      address VARCHAR(255),
      medical_history TEXT,
      created_by INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
      doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
      date TIMESTAMP NOT NULL,
      reason VARCHAR(255),
      status VARCHAR(20) NOT NULL DEFAULT 'Scheduled',
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Migration complete.');
  process.exit(0);
}

migrate().catch(e => {
  console.error(e);
  process.exit(1);
});