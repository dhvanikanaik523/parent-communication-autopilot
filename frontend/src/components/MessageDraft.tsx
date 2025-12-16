import { useState, useEffect } from "react";
import { Card } from "./Card";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Dialog } from "./Dialog";
import { Mail, Edit3, Send, Trash2, MessageSquare } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";

interface Draft {
  id: number;
  student: string;
  subject: string;
  preview: string;
  status: string;
}

interface MessageDraftProps {
  draft: Draft;
}

export const MessageDraft = ({ draft }: MessageDraftProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tone, setTone] = useState("professional"); // Default tone
  const [messageText, setMessageText] = useState(draft.preview);
  const [messageId, setMessageId] = useState<number | null>(null);
  const [subject, setSubject] = useState(draft.subject);
  const API_BASE_URL = "https://parent-communication-autopilot.onrender.com";

  // Fetch or generate AI draft on mount
  useEffect(() => {
    const fetchDraft = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/email/${draft.id}`);
        const data = response.data || {};
        setMessageId(data.id ?? null);
        setMessageText(data.body ?? draft.preview);
        setSubject(data.subject ?? draft.subject);
      } catch (error) {
        console.error('fetchDraft error:', error);
        setMessageText(draft.preview);
        setMessageId(null);
      }
    };
    fetchDraft();
  }, [draft.id, draft.preview, draft.subject]);

  // Handle tone changes via AI redraft
  const handleToneChange = async (newTone: string) => {
    setTone(newTone);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/email/${draft.id}/redraft`, { tone: newTone });
      const drafted = response.data;
      setMessageId(drafted.id ?? null);
      setMessageText(drafted.body ?? draft.preview);
      setSubject(drafted.subject ?? draft.subject);
      console.log('Redraft received:', drafted);
    } catch (err) {
      console.error('Redraft failed:', err);
      alert('AI redraft failed. Using local preview.');
      setMessageText(draft.preview);
    }
  };

  // Handle Generate Message button -> triggers AI draft
  const handleDraft = async () => {
    try {
      console.log("Generating AI draft for alert_id:", draft.id, "with tone:", tone);
      const response = await axios.get(`${API_BASE_URL}/api/email/${draft.id}`);
      const data = response.data || {};
      setMessageId(data.id ?? null);
      setMessageText(data.body ?? draft.preview);
      setSubject(data.subject ?? draft.subject);
      console.log("Draft generated via AI:", data);
    } catch (error) {
      console.error('handleDraft error:', error);
      alert('Unable to generate AI draft. Check server logs.');
      setMessageText(draft.preview);
      setMessageId(null);
    }
  };

  // Handle sending email
  const handleSend = async () => {
    if (!messageId) return;
    try {
      console.log("Sending email with message_id:", messageId);
      const response = await axios.post(`${API_BASE_URL}/api/send`, { message_id: messageId });
      console.log("Email sent:", response.data);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Send email failed:', error);
      alert('Failed to send email. Check server logs.');
    }
  };

  return (
    <>
      <Card className="alert-card">
        <div className="alert-card-content">
          <div className="alert-card-main">
            <div className="alert-card-icon" style={{ backgroundColor: "rgba(37, 99, 235, 0.1)" }}>
              <Mail size={20} />
            </div>
            <div className="alert-card-info">
              <div className="alert-card-header">
                <h3 className="alert-card-title">{draft.student}</h3>
                <Badge variant="outline">{draft.status}</Badge>
              </div>
              <h4 style={{ fontWeight: 500, color: "var(--color-foreground)", marginBottom: "var(--spacing-2)" }}>
                {subject}
              </h4>
              <p
                style={{
                  color: "var(--color-muted-foreground)",
                  fontSize: "0.875rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {messageText}
              </p>
            </div>
          </div>
          <div className="alert-card-actions">
            <div style={{ marginBottom: "var(--spacing-2)" }}>
              <label className="label" style={{ marginRight: "var(--spacing-2)" }}>Tone:</label>
              <Button variant={tone === "professional" ? "default" : "outline"} size="sm" onClick={() => handleToneChange("professional")}>
                Professional
              </Button>
              <Button variant={tone === "friendly" ? "default" : "outline"} size="sm" onClick={() => handleToneChange("friendly")}>
                Friendly
              </Button>
              <Button variant={tone === "urgent" ? "default" : "outline"} size="sm" onClick={() => handleToneChange("urgent")}>
                Urgent
              </Button>
            </div>
            <Button variant="hero" size="sm" onClick={() => setIsDialogOpen(true)}>
              <Edit3 size={16} /> Edit & Generate
            </Button>
            <Button variant="outline" size="sm" onClick={handleDraft}>
              <MessageSquare size={16} /> Generate Message
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 size={16} /> Discard
            </Button>
          </div>
        </div>
      </Card>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={`Edit Message for ${draft.student}'s Parent`}
        description="Customize the message before sending"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={handleSend} disabled={!messageId}>
              <MessageSquare size={16} /> Send Email
            </Button>
          </>
        }
      >
        <div style={{ marginBottom: "var(--spacing-4)" }}>
          <label className="label">Subject</label>
          <input
            type="text"
            className="input"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Message subject..."
          />
        </div>

        <div style={{ marginBottom: "var(--spacing-4)" }}>
          <label className="label">Message Tone</label>
          <div style={{ display: "flex", gap: "var(--spacing-2)" }}>
            <Button variant={tone === "professional" ? "default" : "outline"} size="sm" onClick={() => handleToneChange("professional")}>
              Professional
            </Button>
            <Button variant={tone === "friendly" ? "default" : "outline"} size="sm" onClick={() => handleToneChange("friendly")}>
              Friendly
            </Button>
            <Button variant={tone === "urgent" ? "default" : "outline"} size="sm" onClick={() => handleToneChange("urgent")}>
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
            placeholder="Your message content..."
          />
        </div>
        <Button variant="outline" size="sm" onClick={handleDraft} style={{ marginTop: "var(--spacing-4)" }}>
          Generate Message
        </Button>
      </Dialog>
    </>
  );
};
