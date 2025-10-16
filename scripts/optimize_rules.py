import json
import psycopg2
from sklearn.linear_model import LinearRegression
import numpy as np

# Connect to database
conn = psycopg2.connect(
    dbname="autopilot_db",
    user="postgres",
    password="59246@dhvanika",
    host="localhost"
)
cursor = conn.cursor()

# Fetch edit data (assuming edits indicate rule effectiveness)
cursor.execute("SELECT message_id, original_body, edited_body FROM message_edits")
edits = cursor.fetchall()

# Simple feature: count edits as a proxy for rule needing adjustment
X = np.array([[i + 1] for i in range(len(edits))])  # Time-based index
y = np.array([1 if len(str(edit[2])) > len(str(edit[1])) else 0 for edit in edits])  # Edit length increase

# Train model
model = LinearRegression()
model.fit(X, y)

# Suggest threshold adjustment (simplified: increase threshold if many edits)
threshold_adjustment = model.predict([[len(edits)]])[0]
if threshold_adjustment > 0.5:
    suggestion = "Increase rule threshold (e.g., from 2 to 3 missed assignments)"
else:
    suggestion = "Maintain or decrease rule threshold"

print(json.dumps({"optimization_suggestion": suggestion}))

cursor.close()
conn.close()
