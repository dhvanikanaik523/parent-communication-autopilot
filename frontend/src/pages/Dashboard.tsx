import { useState, useEffect } from "react";
import { DashboardHeader } from "../components/DashboardHeader";
import { AlertCard } from "../components/AlertCard";
import { MessageDraft } from "../components/MessageDraft";
import { StudentOverview } from "../components/StudentOverview";
import { Card } from "../components/Card";
import { Tabs } from "../components/Tabs";
import { Bell, MessageSquare, Users, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import axios from "axios";

const Dashboard = () => {

  // Define the raw data interface based on your DB schema and API
interface RawApiAlert {
  priority: any;
  id: number;
  rule_id: number | null; // Assuming rule_id can be null if it's an FK
  student_id: string; 
  alert_message: string;
  created_at: string; // TIMESTAMP from DB
}

// Define the interface for the 'alerts' state (the processed data)
interface ProcessedAlert {
  id: number;
  student: string;
  type: string;
  severity: string; // Keep as string since we can't infer the enum (high/medium/low) without assumptions
  message: string;
  date: string;
}

// Define the interface for the 'drafts' state
interface ProcessedDraft {
  id: number;
  student: string;
  subject: string;
  preview: string;
  status: string;
}

const [alerts, setAlerts] = useState<ProcessedAlert[]>([]);
const [drafts, setDrafts] = useState<ProcessedDraft[]>([]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<RawApiAlert[]>("http://localhost:3000/api/alerts")
      .then((response) => {
        const mappedAlerts: ProcessedAlert[] = response.data.map((alert) => ({
          id: alert.id,
          student: alert.alert_message.split(": ")[0],
          type: "attendance", // Adjust based on actual logic later
          severity: alert.priority,
          message: alert.alert_message,
          date: new Date(alert.created_at).toLocaleString(),
        }));
  
        setAlerts(mappedAlerts);
  
        const mappedDrafts: ProcessedDraft[] = mappedAlerts.map((alert) => ({
          id: alert.id,
          student: alert.student,
          subject: `Update on ${alert.student} - ${alert.severity}`,
          preview: alert.message,
          status: alert.severity === "high" ? "pending" : "ready",
        }));
  
        setDrafts(mappedDrafts);
      })
      .catch((error) => {
        console.error("Error fetching alerts:", error);
        setError("Failed to load data. Check the backend.");
      });
  }, []);
  
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!alerts.length && !drafts.length) return <div>Loading...</div>;

  const tabs = [
    {
      value: "alerts",
      label: "Alerts",
      icon: <Bell size={16} />,
      content: (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      ),
    },
    {
      value: "drafts",
      label: "Drafts",
      icon: <MessageSquare size={16} />,
      content: (
        <div className="space-y-4">
          {drafts.map((draft) => (
            <MessageDraft key={draft.id} draft={draft} />
          ))}
        </div>
      ),
    },
    {
      value: "students",
      label: "Students",
      icon: <Users size={16} />,
      content: <StudentOverview />,
    },
  ];

  return (
    <div className="dashboard">
      <DashboardHeader />
      <main className="container dashboard-main">
        {/* Stats Overview */}
        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-card-content">
              <div>
                <p className="stat-label">Active Alerts</p>
                <h3 className="stat-value">{alerts.length}</h3>
              </div>
              <div className="stat-icon" style={{ backgroundColor: "rgba(251, 146, 60, 0.1)" }}>
                <AlertTriangle size={24} style={{ color: "var(--color-warning)" }} />
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-card-content">
              <div>
                <p className="stat-label">Pending Drafts</p>
                <h3 className="stat-value">{drafts.filter((d) => d.status === "pending").length}</h3>
              </div>
              <div className="stat-icon" style={{ backgroundColor: "rgba(37, 99, 235, 0.1)" }}>
                <MessageSquare size={24} style={{ color: "var(--color-primary)" }} />
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-card-content">
              <div>
                <p className="stat-label">Sent Today</p>
                <h3 className="stat-value">0</h3> {/* Requires backend tracking */}
              </div>
              <div className="stat-icon" style={{ backgroundColor: "rgba(34, 197, 94, 0.1)" }}>
                <CheckCircle2 size={24} style={{ color: "var(--color-success)" }} />
              </div>
            </div>
          </Card>

          <Card className="stat-card">
            <div className="stat-card-content">
              <div>
                <p className="stat-label">Students</p>
                <h3 className="stat-value">87</h3> {/* Requires backend data */}
              </div>
              <div className="stat-icon" style={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}>
                <Users size={24} style={{ color: "var(--color-secondary)" }} />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs tabs={tabs} defaultValue="alerts" />
      </main>
    </div>
  );
};

export default Dashboard;