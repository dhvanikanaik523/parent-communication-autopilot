const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function seedData() {
  try {
    // Insert sample rules
    await pool.query('INSERT INTO rules (teacher_id, condition, alert_message) VALUES ("T001", "missed_assignments >= 2", "Missed homework alert") ON CONFLICT (teacher_id) DO NOTHING');
    
    // Trigger monitoring to generate alerts
    await pool.query('INSERT INTO alerts (rule_id, student_id, alert_message) VALUES (1, "S001", "Diego: Missed homework alert") ON CONFLICT (student_id) DO NOTHING');
    
    // Generate a draft
    await pool.query('INSERT INTO messages (alert_id, recipient_email, subject, body, tone) VALUES (1, "parent_diego@example.com", "Update on Diego", "Hello, Diego missed homework. Let\'s discuss.", "empathetic") ON CONFLICT (alert_id) DO NOTHING');
    
    console.log('Demo data seeded successfully!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    pool.end();
  }
}

seedData();