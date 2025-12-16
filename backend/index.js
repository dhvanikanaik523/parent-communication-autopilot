

// index.debug.js
const express = require('express');
const { Pool } = require('pg');
const fetch = require('node-fetch');
const { spawn } = require('child_process');
const PORT = process.env.PORT || 3000;
require('dotenv').config({ path: '../.env' });






// const transporter.verify((error, success) => {
//   if (error) console.error('Email setup failed:', error);
//   else console.log('Email server is ready');
// });


const mockData = require('./mock-data');

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(express.json());

const cors = require('cors');
app.use(cors());
const nodemailer = require('nodemailer');
const cron = require('node-cron');

// const pool = new Pool({
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT || 5432),
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

module.exports = pool;

// -- Startup diagnostics --
(async () => {
  try {
    // Print DB config (redact password)
    console.log('DB config ->', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
    });

    const client = await pool.connect();
    try {
      const db = await client.query('SELECT current_database() AS db, current_schema() AS schema;');
      console.log('Connected DB at startup:', db.rows[0]);
      // Check info_schema for rules table
      const info = await client.query(`
        SELECT table_schema, table_name
        FROM information_schema.tables
        WHERE table_name = 'rules';
      `);
      console.log('info_schema.rules =>', info.rows);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Startup DB diagnostic failed:', err && err.message ? err.message : err);
  }
})();

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT current_database() AS db, current_schema() AS schema;');
    res.json({ status: 'Database connected', db: result.rows[0] });
  } catch (err) {
    console.error('/api/health error:', err);
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

// Add rule
app.post('/api/rules', async (req, res) => {
  const { teacher_id, condition, alert_message } = req.body;
  try {
    const result = await pool.query(
      // explicitly include schema
      'INSERT INTO public.rules (teacher_id, condition, alert_message) VALUES ($1, $2, $3) RETURNING *',
      [teacher_id, condition, alert_message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/rules error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Monitor and generate alerts
app.post('/api/monitor', async (req, res) => {
  try {
    const rules = await pool.query('SELECT * FROM public.rules');
    const alerts = [];
    for (const rule of rules.rows) {
      for (const student of mockData.students) {
        // WARNING: using eval is unsafe. Keep for quick local testing only.
        if (eval(`student.${rule.condition}`)) {
          const alert = {
            rule_id: rule.id,
            student_id: student.student_id,
            alert_message: `${student.name}: ${rule.alert_message}`,
          };
          const result = await pool.query(
            'INSERT INTO public.alerts (rule_id, student_id, alert_message) VALUES ($1, $2, $3) RETURNING *',
            [alert.rule_id, alert.student_id, alert.alert_message]
          );
          alerts.push(result.rows[0]);
        }
      }
    }
    res.json(alerts);
  } catch (err) {
    console.error('POST /api/monitor error:', err);
    res.status(500).json({ error: err.message });
  }
});




// Replace your current /api/draft handler with this
app.post('/api/draft', async (req, res) => {
  const { alert_id, tone = 'professional' } = req.body;
  console.log('Draft request:', { alert_id, tone });
  if (!alert_id) return res.status(400).json({ error: 'Missing alert_id' });

  try {
    const alertQ = await pool.query('SELECT * FROM alerts WHERE id = $1', [alert_id]);
    if (alertQ.rows.length === 0) return res.status(404).json({ error: 'Alert not found' });

    const alertRow = alertQ.rows[0];
    const { student_id, alert_message } = alertRow;

    // Build subject/body based on tone
    let subject, body;
    const namePart = (student_id && String(student_id).includes('-')) ? String(student_id).split('-')[1] : student_id;
    if (tone === 'urgent') {
      subject = `IMPORTANT: ${alert_message.split(': ')[0]} — Action Required`;
      body = `IMPORTANT: ${alert_message}. Immediate attention needed.`;
    } else if (tone === 'friendly') {
      subject = `Quick update about ${namePart || 'your child'}`;
      body = `Hi there, ${alert_message}. Let’s chat — warm regards.`;
    } else {
      subject = `Concern about ${namePart || 'your child'}`;
      body = `Dear Parent, ${alert_message}. Please address this.`;
    }

    const recipient_email = `parent_${String(student_id).toLowerCase()}@example.com`;

    // Prepare params and log them for debugging
    const sql = 'INSERT INTO messages (alert_id, recipient_email, subject, body, tone) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const params = [alert_id, recipient_email, subject, body, tone];
    console.log('About to run SQL:', sql);
    console.log('PARAMS length:', params.length, 'PARAMS:', params);

    const result = await pool.query(sql, params);

    console.log('Draft created:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Draft error:', err);
    res.status(500).json({ error: err.message });
  }
});




app.get('/api/alerts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM alerts ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/messages', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM messages ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Schedule monitoring every 5 minutes for testing
cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('Running scheduled monitoring at:', new Date().toLocaleString());
    const rules = await pool.query('SELECT * FROM rules');
    const alerts = [];
    for (const rule of rules.rows) {
      for (const student of mockData.students) {
        if (eval(`student.${rule.condition}`)) {
          const missedCount = eval(`student.${rule.condition.split('>=')[0]}`) || 0;
          const priority = missedCount > 3 ? 'high' : 'normal';
          const alert = {
            rule_id: rule.id,
            student_id: student.student_id,
            alert_message: `${student.name}: ${rule.alert_message} (Priority: ${priority})`,
          };
          const result = await pool.query(
            'INSERT INTO alerts (rule_id, student_id, alert_message, priority) VALUES ($1, $2, $3, $4) RETURNING *',
            [alert.rule_id, alert.student_id, alert.alert_message, priority]
          );
          alerts.push(result.rows[0]);
        }
      }
    }
    console.log('Monitoring completed, alerts generated:', alerts.length);
  } catch (err) {
    console.error('Scheduled monitoring failed:', err.message);
  }
});


cron.schedule('0 0 * * *', async () => { // Daily at midnight
  try {
    console.log('Running rule optimization at:', new Date().toLocaleString());
    const python = spawn('/Users/dhvanika/parent-communication-autopilot/scripts/venv/bin/python3', [
      '../scripts/optimize_rules.py'
    ]);
    let output = '';
    python.stdout.on('data', (data) => output += data);
    python.on('close', (code) => {
      if (code === 0) {
        console.log('Optimization suggestion:', output);
      } else {
        console.error('Optimization failed');
      }
    });
  } catch (err) {
    console.error('Optimization error:', err.message);
  }
});

app.post('/api/send', async (req, res) => {
  const { message_id } = req.body;
  console.log('Send request:', { message_id });
  if (!message_id) return res.status(400).json({ error: 'Missing message_id' });

  try {
    const message = await pool.query('SELECT * FROM messages WHERE id = $1', [message_id]);
    console.log('Message query result:', message.rows);
    if (message.rows.length === 0) return res.status(404).json({ error: 'Message not found' });

    const { recipient_email, subject, body } = message.rows[0];
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipient_email,
      subject: subject,
      text: body,
      html: `<p>${body.replace(/\n/g, '<br>')}</p>`,
    });

    const result = await pool.query(
      'UPDATE messages SET sent_at = NOW() WHERE id = $1 RETURNING *',
      [message_id]
    );
    console.log('Message updated:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Send email error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/email/:alertId', async (req, res) => {
  const { alertId } = req.params;
  console.log(`Fetching email for alertId: ${alertId}`);
  try {
    const alert = await pool.query('SELECT * FROM alerts WHERE id = $1', [alertId]);
    if (alert.rows.length === 0) {
      console.log('Alert not found');
      return res.status(404).json({ error: 'Alert not found' });
    }
    console.log('Alert found:', alert.rows[0].alert_message);

    const message = await pool.query(
      'SELECT * FROM messages WHERE alert_id = $1 AND sent_at IS NULL LIMIT 1',
      [alertId]
    );
    console.log('Existing message check:', message.rows.length ? 'Found' : 'Not found');

    if (message.rows.length === 0) {
      console.log('No existing message, triggering Drafting Agent');
      const [studentName] = alert.rows[0].alert_message.split(': ');
      const alertMessage = alert.rows[0].alert_message;
      console.log('Spawning with input:', JSON.stringify({ student_name: studentName, alert_message: alertMessage, tone: 'empathetic' }));
      const python = spawn('/Users/dhvanika/parent-communication-autopilot/scripts/venv/bin/python3', [
        '../scripts/draft_message.py',
        JSON.stringify({ student_name: studentName, alert_message: alertMessage, tone: 'empathetic' })
      ]);
      let output = '';
      let errorOutput = '';
      python.stdout.on('data', (data) => {
        const text = data.toString();
        output += text;
        console.log('Drafting output:', text);
      });
      python.stderr.on('data', (data) => {
        const text = data.toString();
        errorOutput += text;
        console.error('Drafting error:', text);
      });
      const result = await new Promise((resolve, reject) => {
        python.on('close', async (code) => {
          console.log('Drafting process exited with code:', code);
          if (code !== 0) {
            console.error('Full error output:', errorOutput);
            reject(new Error('Drafting process failed'));
          } else {
            console.log('Drafting output received:', output);
            try {
              const draft = JSON.parse(output);
              console.log('Parsed draft:', draft);
              const result = await pool.query(
                'INSERT INTO messages (alert_id, recipient_email, subject, body, tone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [alertId, draft.recipient_email, draft.subject, draft.body, draft.tone]
              );
              console.log('Draft saved to database:', result.rows[0]);
              resolve(result.rows[0]);
            } catch (parseErr) {
              console.error('JSON parse error:', parseErr.message, 'Output:', output);
              reject(new Error(`Failed to parse draft: ${parseErr.message}`));
            }
          }
        });
      });
      res.json(result);
    } else {
      console.log('Returning existing message:', message.rows[0]);
      res.json(message.rows[0]);
    }
  } catch (err) {
    console.error('GET /api/email/:alertId error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/email/:alertId/redraft', async (req, res) => {
  const { alertId } = req.params;
  const { tone } = req.body;
  try {
    const alert = await pool.query('SELECT * FROM alerts WHERE id = $1', [alertId]);
    if (alert.rows.length === 0) return res.status(404).json({ error: 'Alert not found' });

    const [studentName] = alert.rows[0].alert_message.split(': ');
    const alertMessage = alert.rows[0].alert_message;
    const python = spawn('/Users/dhvanika/parent-communication-autopilot/scripts/venv/bin/python3', [
      '../scripts/draft_message.py',
      JSON.stringify({ student_name: studentName, alert_message: alertMessage, tone })
    ]);
    let output = '';
    python.stdout.on('data', (data) => output += data.toString());
    python.stderr.on('data', (data) => console.error('Redraft error:', data.toString()));
    await new Promise((resolve, reject) => {
      python.on('close', async (code) => {
        if (code !== 0) {
          reject(new Error('Redraft process failed'));
        } else {
          try {
            const draft = JSON.parse(output);
            await pool.query(
              'DELETE FROM messages WHERE alert_id = $1 AND sent_at IS NULL',
              [alertId]
            );
            const result = await pool.query(
              'INSERT INTO messages (alert_id, recipient_email, subject, body, tone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
              [alertId, draft.recipient_email, draft.subject, draft.body, draft.tone]
            );
            resolve(result.rows[0]);
          } catch (parseErr) {
            reject(new Error(`Failed to parse redraft: ${parseErr.message}`));
          }
        }
      });
    }).then(draftedMessage => res.json(draftedMessage))
      .catch(err => res.status(500).json({ error: err.message }));
  } catch (err) {
    console.error('POST /api/email/:alertId/redraft error:', err.message);
    console.log('Redrafting with tone:', tone);
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/email/:alertId', async (req, res) => {
  const { alertId } = req.params;
  const { recipient_email, subject, body, tone } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO messages (alert_id, recipient_email, subject, body, tone, sent_at) VALUES ($1, $2, $3, $4, $5, NOW()) ON CONFLICT (alert_id) DO UPDATE SET recipient_email = $2, subject = $3, body = $4, tone = $5, sent_at = NOW() RETURNING *',
      [alertId, recipient_email, subject, body, tone]
    );
    
    await transporter.sendMail({ from: process.env.EMAIL_USER, to: recipient_email, subject, text: body });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});



app.use('/api', require('./routes/alerts'));
// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: "Backend is LIVE!", timestamp: new Date().toISOString() });
});

// Root route (to avoid "Not Found")
app.get('/', (req, res) => {
  res.json({ message: "Parent Communication Autopilot Backend is running!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // console.log(`http://localhost:${PORT}`);
});



