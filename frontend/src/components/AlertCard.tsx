import { useState } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Dialog } from "./Dialog";
import { AlertTriangle, Clock, MessageSquare, CheckCircle2 } from "lucide-react";

interface Alert {
  id: number;
  student: string;
  type: string;
  severity: string;
  message: string;
  date: string;
}

interface AlertCardProps {
  alert: Alert;
}

export const AlertCard = ({ alert }: AlertCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tone, setTone] = useState("professional");
  const [messageText, setMessageText] = useState("");

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "attendance":
        return <AlertTriangle size={20} />;
      case "assignments":
        return <Clock size={20} />;
      case "behavior":
        return <CheckCircle2 size={20} />;
      default:
        return <AlertTriangle size={20} />;
    }
  };

  const generateMessage = () => {
    const templates = {
      professional: `Dear Parent/Guardian,\n\nI am writing to inform you about ${alert.message.toLowerCase()} for ${alert.student}. I believe that by working together, we can help address this situation and support your child's success.\n\nPlease feel free to contact me to discuss this matter further.\n\nBest regards,\nTeacher`,
      friendly: `Hi there!\n\nI wanted to reach out about ${alert.student}. I've noticed that ${alert.message.toLowerCase()}. Let's work together to help them get back on track!\n\nLooking forward to hearing from you soon.\n\nWarm regards,\nTeacher`,
      urgent: `IMPORTANT: Immediate Attention Required\n\nDear Parent/Guardian,\n\nThis message requires your prompt attention. ${alert.student} has ${alert.message.toLowerCase()}. Please contact me as soon as possible to discuss this matter.\n\nSincerely,\nTeacher`
    };
    
    setMessageText(templates[tone as keyof typeof templates] || templates.professional);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
    generateMessage();
  };

  const handleToneChange = (newTone: string) => {
    setTone(newTone);
    const templates = {
      professional: `Dear Parent/Guardian,\n\nI am writing to inform you about ${alert.message.toLowerCase()} for ${alert.student}. I believe that by working together, we can help address this situation and support your child's success.\n\nPlease feel free to contact me to discuss this matter further.\n\nBest regards,\nTeacher`,
      friendly: `Hi there!\n\nI wanted to reach out about ${alert.student}. I've noticed that ${alert.message.toLowerCase()}. Let's work together to help them get back on track!\n\nLooking forward to hearing from you soon.\n\nWarm regards,\nTeacher`,
      urgent: `IMPORTANT: Immediate Attention Required\n\nDear Parent/Guardian,\n\nThis message requires your prompt attention. ${alert.student} has ${alert.message.toLowerCase()}. Please contact me as soon as possible to discuss this matter.\n\nSincerely,\nTeacher`
    };
    setMessageText(templates[newTone as keyof typeof templates] || templates.professional);
  };

  const handleSend = () => {
    console.log("Sending message:", messageText);
    setIsDialogOpen(false);
    // Here you would implement the actual send functionality
  };

  const iconBgColor = {
    high: { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
    medium: { backgroundColor: 'rgba(251, 146, 60, 0.1)' },
    low: { backgroundColor: 'rgba(34, 197, 94, 0.1)' }
  };

  return (
    <>
      <Card className="alert-card">
        <div className="alert-card-content">
          <div className="alert-card-main">
            <div className="alert-card-icon" style={iconBgColor[alert.severity as keyof typeof iconBgColor]}>
              {getTypeIcon(alert.type)}
            </div>
            
            <div className="alert-card-info">
              <div className="alert-card-header">
                <h3 className="alert-card-title">{alert.student}</h3>
                <Badge variant={getSeverityColor(alert.severity) as any}>
                  {alert.severity}
                </Badge>
                <Badge variant="outline">{alert.type}</Badge>
              </div>
              <p className="alert-card-message">{alert.message}</p>
              <p className="alert-card-date">
                <Clock size={12} style={{ marginRight: '4px' }} />
                {alert.date}
              </p>
            </div>
          </div>

          <div className="alert-card-actions">
            <Button variant="hero" size="sm" onClick={handleOpenDialog}>
              <MessageSquare size={16} />
              Generate Message
            </Button>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </Card>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={`Message for ${alert.student}'s Parent`}
        description="Edit and customize the AI-generated message below"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={handleSend}>
              <MessageSquare size={16} />
              Send Message
            </Button>
          </>
        }
      >
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <label className="label">Message Tone</label>
          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
            <Button
              variant={tone === "professional" ? "default" : "outline"}
              size="sm"
              onClick={() => handleToneChange("professional")}
            >
              Professional
            </Button>
            <Button
              variant={tone === "friendly" ? "default" : "outline"}
              size="sm"
              onClick={() => handleToneChange("friendly")}
            >
              Friendly
            </Button>
            <Button
              variant={tone === "urgent" ? "default" : "outline"}
              size="sm"
              onClick={() => handleToneChange("urgent")}
            >
              Urgent
            </Button>
          </div>
        </div>

        <div>
          <label className="label">Message Content</label>
          <textarea
            className="textarea"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={10}
            placeholder="Your message will appear here..."
          />
        </div>

        <div style={{ marginTop: 'var(--spacing-4)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-muted)', borderRadius: 'var(--radius-md)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-foreground)' }}>
            <strong>Alert Context:</strong> {alert.message}
          </p>
        </div>
      </Dialog>
    </>
  );
};
