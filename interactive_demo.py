import json
import sys
from scripts.draft_message import main as run_agent

print("=== Parent Communication Autopilot - Drafting Agent Demo ===\n")

# Demo inputs
demo_cases = [
    {"student_name": "Emma Johnson", "alert_message": "Emma missed 3 classes this week", "tone": "empathetic"},
    {"student_name": "Liam Chen", "alert_message": "Liam has 2 missing assignments", "tone": "urgent"},
    {"student_name": "Olivia Martinez", "alert_message": "Olivia received a positive behavior note", "tone": "positive"},
]

print("Generating drafts using DistilGPT2...\n")

for case in demo_cases:
    print(f"Student: {case['student_name']}")
    print(f"Alert: {case['alert_message']}")
    print(f"Tone: {case['tone'].title()}")
    print("-" * 50)
    
    # Run the agent
    sys.argv = [sys.argv[0], json.dumps(case)]
    try:
        run_agent()
    except:
        print("Generated draft above ↑\n")
    print("=" * 60 + "\n")