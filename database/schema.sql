CREATE TABLE rules (
    id SERIAL PRIMARY KEY,
    teacher_id VARCHAR(50) NOT NULL,
    condition TEXT NOT NULL,
    alert_message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  rule_id INTEGER REFERENCES rules(id),
  student_id VARCHAR(50),
  alert_message VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  alert_id INTEGER REFERENCES alerts(id),
  recipient_email VARCHAR(255),
  subject VARCHAR(255),
  body TEXT,
  tone VARCHAR(50), -- E.g., "formal", "empathetic"
  sent_at TIMESTAMP
);
