import { Card } from "./Card";
import { Badge } from "./Badge";
import { Progress } from "./Progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const StudentOverview = () => {
  const students = [
    {
      id: 1,
      name: "Emma Johnson",
      attendance: 85,
      assignments: 92,
      trend: "up",
      status: "needs-attention",
    },
    {
      id: 2,
      name: "Michael Chen",
      attendance: 95,
      assignments: 88,
      trend: "down",
      status: "on-track",
    },
    {
      id: 3,
      name: "Sarah Williams",
      attendance: 98,
      assignments: 95,
      trend: "up",
      status: "excellent",
    },
    {
      id: 4,
      name: "David Martinez",
      attendance: 78,
      assignments: 75,
      trend: "stable",
      status: "at-risk",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      "excellent": "success",
      "on-track": "default",
      "needs-attention": "warning",
      "at-risk": "destructive"
    };
    
    const labels: { [key: string]: string } = {
      "excellent": "Excellent",
      "on-track": "On Track",
      "needs-attention": "Needs Attention",
      "at-risk": "At Risk"
    };
    
    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getTrendIcon = (trend: string) => {
    const iconStyle = { width: '16px', height: '16px' };
    switch (trend) {
      case "up":
        return <TrendingUp style={{ ...iconStyle, color: 'var(--color-success)' }} />;
      case "down":
        return <TrendingDown style={{ ...iconStyle, color: 'var(--color-destructive)' }} />;
      default:
        return <Minus style={{ ...iconStyle, color: 'var(--color-muted-foreground)' }} />;
    }
  };

  return (
    <div className="space-y-4">
      {students.map((student) => (
        <Card key={student.id} className="student-card">
          <div className="student-card-header">
            <div className="student-card-info">
              <div className="student-avatar">
                {student.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <h3 className="student-name">{student.name}</h3>
                <div className="student-badges">
                  {getStatusBadge(student.status)}
                  {getTrendIcon(student.trend)}
                </div>
              </div>
            </div>
          </div>

          <div className="student-metrics">
            <div className="student-metric">
              <div className="student-metric-header">
                <span className="student-metric-label">Attendance</span>
                <span className="student-metric-value">{student.attendance}%</span>
              </div>
              <Progress value={student.attendance} />
            </div>

            <div className="student-metric">
              <div className="student-metric-header">
                <span className="student-metric-label">Assignments</span>
                <span className="student-metric-value">{student.assignments}%</span>
              </div>
              <Progress value={student.assignments} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
