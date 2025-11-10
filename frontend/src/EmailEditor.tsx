import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

// Define the shape of the email object
interface Email {
  recipient_email: string;
  subject: string;
  body: string;
  tone: string;
}

function EmailEditor() {
  const { alertId } = useParams<{ alertId: string }>(); // Type for useParams
  const navigate = useNavigate();
  const [email, setEmail] = useState<Email>({
    recipient_email: "",
    subject: "",
    body: "",
    tone: "empathetic",
  }); // Typed useState
  const [loading, setLoading] = useState<boolean>(true); // Typed useState
  const API_URL = "https://parent-communication-autopilot-production-4f87.up.railway.app";
  useEffect(() => {
    setLoading(true);
    axios
      .get<Email>("${API_URL}/api/email/${alertId}")
      .then((response) => {
        setEmail(response.data);
      })
      .catch((error) => console.error("Error fetching email:", error))
      .finally(() => setLoading(false));
  }, [alertId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmail((prev) => ({ ...prev, [name]: value }));
  };

  const handleRedraft = async (newTone: string) => {
    setLoading(true);
    try {
      const response = await axios.post<Email>("${API_URL}/api/email/${alertId}/redraft", { tone: newTone });
      setEmail(response.data);
    } catch (error) {
      console.error("Error redrafting:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    try {
      await axios.post("${API_URL}/api/email/${alertId}", email);
      navigate("/");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  if (loading) return <div style={{ textAlign: "center", color: "#34495e" }}>Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: "800px" }}>
      <h1>Email Editor</h1>
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <label>
            To:{" "}
            <input
              type="email"
              name="recipient_email"
              value={email.recipient_email}
              onChange={handleChange}
            />
          </label>
          <label>
            Subject:{" "}
            <input type="text" name="subject" value={email.subject} onChange={handleChange} />
          </label>
          <label>
            Body:{" "}
            <textarea name="body" value={email.body} onChange={handleChange} rows={10} />
          </label>
          <label>
            Tone:{" "}
            <select name="tone" value={email.tone} onChange={(e) => handleRedraft(e.target.value)}>
              <option value="empathetic">Empathetic</option>
              <option value="formal">Formal</option>
              <option value="encouraging">Encouraging</option>
              <option value="urgent">Urgent</option>
              <option value="positive">Positive</option>
              <option value="informative">Informative</option>
            </select>
          </label>
          <button onClick={handleSend} style={{ marginRight: "10px" }}>
            Send
          </button>
          <button onClick={() => navigate("/")}>Cancel</button>
        </div>
        <div style={{ flex: 1 }}>
          <h3>Preview</h3>
          <p>
            <strong>To:</strong> {email.recipient_email}
          </p>
          <p>
            <strong>Subject:</strong> {email.subject}
          </p>
          <p>
            <strong>Body:</strong> {email.body}
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmailEditor;