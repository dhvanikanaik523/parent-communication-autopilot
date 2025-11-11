import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ArrowRight, Bot, MessageSquare, BarChart3, Clock, CheckCircle2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-background)" }}>
      {/* Hero Section */}
      <section className="hero-section" style={{ background: "linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(139, 92, 246, 0.95))" }}>
        <div className="container hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>AI-Powered Communication Platform</span>
          </div>
          <h1 className="hero-title">
            Parent Communication
            <br />
            <span className="hero-gradient-text">On Autopilot</span>
          </h1>
          <p className="hero-description">
            Save over 5 hours per week by automating student monitoring and parent communications with intelligent AI agents
          </p>
          <div className="hero-actions">
            <Link to="/dashboard">
              <Button variant="hero" size="lg" style={{ backgroundColor: "white", color:"black" }}>
                Get Started
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              style={{
                borderWidth: "2px",
                borderColor: "white",
                color: "white",
                backgroundColor: "transparent",
              }}
            >
              Watch Demo
            </Button>
          </div>
        </div>
        <div className="hero-decorative">
          <div
            className="hero-decorative-circle"
            style={{
              top: "25%",
              left: "25%",
              width: "16rem",
              height: "16rem",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            }}
          ></div>
          <div
            className="hero-decorative-circle"
            style={{
              bottom: "25%",
              right: "25%",
              width: "24rem",
              height: "24rem",
              backgroundColor: "rgba(167, 139, 250, 0.1)",
            }}
          ></div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="section" style={{ backgroundColor: "rgba(229, 231, 235, 0.3)" }}>
        <div className="container">
          <div style={{ maxWidth: "64rem", margin: "0 auto", textAlign: "center" }}>
            <h2 className="section-title">The Challenge Teachers Face</h2>
            <p className="section-description">
              K-12 teachers spend over{" "}
              <span style={{ color: "var(--color-warning)", fontWeight: "bold" }}>5 hours each week</span> manually
              monitoring student data and drafting parent communications. For a district with 1,000 teachers, that's{" "}
              <span style={{ color: "var(--color-warning)", fontWeight: "bold" }}>5,000+ hours wasted weekly</span>.
            </p>
            <div className="grid grid-cols-1 md-grid-cols-3 gap-6" style={{ marginTop: "var(--spacing-12)" }}>
              <Card style={{ padding: "var(--spacing-6)", boxShadow: "var(--shadow-md)" }}>
                <Clock size={48} style={{ color: "var(--color-warning)", margin: "0 auto var(--spacing-4)" }} />
                <h3 style={{ fontWeight: 600, fontSize: "1.125rem", marginBottom: "var(--spacing-2)", color: "var(--color-foreground)" }}>
                  Delayed Notifications
                </h3>
                <p style={{ color: "var(--color-muted-foreground)", fontSize: "0.875rem" }}>Missing critical intervention opportunities</p>
              </Card>
              <Card style={{ padding: "var(--spacing-6)", boxShadow: "var(--shadow-md)" }}>
                <BarChart3 size={48} style={{ color: "var(--color-destructive)", margin: "0 auto var(--spacing-4)" }} />
                <h3 style={{ fontWeight: 600, fontSize: "1.125rem", marginBottom: "var(--spacing-2)", color: "var(--color-foreground)" }}>
                  Teacher Burnout
                </h3>
                <p style={{ color: "var(--color-muted-foreground)", fontSize: "0.875rem" }}>Administrative overload on top of teaching duties</p>
              </Card>
              <Card style={{ padding: "var(--spacing-6)", boxShadow: "var(--shadow-md)" }}>
                <Clock size={48} style={{ color: "var(--color-primary)", margin: "0 auto var(--spacing-4)" }} />
                <h3 style={{ fontWeight: 600, fontSize: "1.125rem", marginBottom: "var(--spacing-2)", color: "var(--color-foreground)" }}>
                  Lost Instructional Time
                </h3>
                <p style={{ color: "var(--color-muted-foreground)", fontSize: "0.875rem" }}>Repetitive tasks reduce time for actual teaching</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: "var(--spacing-16)" }}>
            <h2 className="section-title">Two Intelligent Agents, One Powerful Solution</h2>
            <p className="section-description">
              Our agentic AI platform automates the entire communication workflow while keeping you in control
            </p>
          </div>
          <div className="grid grid-cols-1 lg-grid-cols-2 gap-8" style={{ maxWidth: "80rem", margin: "0 auto var(--spacing-12)" }}>
            <Card className="feature-card">
              <Bot size={48} style={{ margin: "0 auto var(--spacing-4)", color: "var(--color-primary)" }} /> {/* Replaced monitoringIcon */}
              <h3 className="feature-title">Monitoring Agent</h3>
              <p className="feature-description">
                Continuously scans SIS/LMS data against your predefined rules to identify when parent communication is needed
              </p>
              <ul className="feature-list space-y-3">
                <li className="feature-list-item">
                  <CheckCircle2 size={20} style={{ color: "var(--color-success)", marginRight: "var(--spacing-3)", marginTop: "2px", flexShrink: 0 }} />
                  <span style={{ color: "var(--color-foreground)" }}>Automated attendance tracking and alerts</span>
                </li>
                <li className="feature-list-item">
                  <CheckCircle2 size={20} style={{ color: "var(--color-success)", marginRight: "var(--spacing-3)", marginTop: "2px", flexShrink: 0 }} />
                  <span style={{ color: "var(--color-foreground)" }}>Assignment submission monitoring</span>
                </li>
                <li className="feature-list-item">
                  <CheckCircle2 size={20} style={{ color: "var(--color-success)", marginRight: "var(--spacing-3)", marginTop: "2px", flexShrink: 0 }} />
                  <span style={{ color: "var(--color-foreground)" }}>Behavior pattern recognition</span>
                </li>
                <li className="feature-list-item">
                  <CheckCircle2 size={20} style={{ color: "var(--color-success)", marginRight: "var(--spacing-3)", marginTop: "2px", flexShrink: 0 }} />
                  <span style={{ color: "var(--color-foreground)" }}>Custom rule configuration</span>
                </li>
              </ul>
            </Card>
            <Card className="feature-card">
              <MessageSquare size={48} style={{ margin: "0 auto var(--spacing-4)", color: "var(--color-secondary)" }} /> {/* Replaced draftingIcon */}
              <h3 className="feature-title">Drafting Agent</h3>
              <p className="feature-description">
                Generates personalized, context-aware messages for parents based on these alerts and your preferences
              </p>
              <ul className="feature-list space-y-3">
                <li className="feature-list-item">
                  <CheckCircle2 size={20} style={{ color: "var(--color-success)", marginRight: "var(--spacing-3)", marginTop: "2px", flexShrink: 0 }} />
                  <span style={{ color: "var(--color-foreground)" }}>AI-powered message personalization</span>
                </li>
                <li className="feature-list-item">
                  <CheckCircle2 size={20} style={{ color: "var(--color-success)", marginRight: "var(--spacing-3)", marginTop: "2px", flexShrink: 0 }} />
                  <span style={{ color: "var(--color-foreground)" }}>Multiple tone options (formal, friendly, urgent)</span>
                </li>
                <li className="feature-list-item">
                  <CheckCircle2 size={20} style={{ color: "var(--color-success)", marginRight: "var(--spacing-3)", marginTop: "2px", flexShrink: 0 }} />
                  <span style={{ color: "var(--color-foreground)" }}>Template library with customization</span>
                </li>
                <li className="feature-list-item">
                  <CheckCircle2 size={20} style={{ color: "var(--color-success)", marginRight: "var(--spacing-3)", marginTop: "2px", flexShrink: 0 }} />
                  <span style={{ color: "var(--color-foreground)" }}>Teacher review and approval workflow</span>
                </li>
              </ul>
            </Card>
          </div>
          <div className="grid grid-cols-1 md-grid-cols-2 lg-grid-cols-4 gap-6" style={{ maxWidth: "80rem", margin: "0 auto" }}>
            <Card style={{ padding: "var(--spacing-6)", boxShadow: "var(--shadow-md)", textAlign: "center", transition: "box-shadow 0.3s ease" }}>
              <Bot size={48} style={{ color: "var(--color-primary)", margin: "0 auto var(--spacing-4)" }} />
              <h4 style={{ fontWeight: 600, color: "var(--color-foreground)", marginBottom: "var(--spacing-2)" }}>Task Automation</h4>
              <p style={{ fontSize: "0.875rem", color: "var(--color-muted-foreground)" }}>Automatically monitors and drafts communications</p>
            </Card>
            <Card style={{ padding: "var(--spacing-6)", boxShadow: "var(--shadow-md)", textAlign: "center", transition: "box-shadow 0.3s ease" }}>
              <BarChart3 size={48} style={{ color: "var(--color-secondary)", margin: "0 auto var(--spacing-4)" }} /> {/* Replaced dashboardIcon */}
              <h4 style={{ fontWeight: 600, color: "var(--color-foreground)", marginBottom: "var(--spacing-2)" }}>Central Dashboard</h4>
              <p style={{ fontSize: "0.875rem", color: "var(--color-muted-foreground)" }}>Manage alerts, drafts, and scheduling in one place</p>
            </Card>
            <Card style={{ padding: "var(--spacing-6)", boxShadow: "var(--shadow-md)", textAlign: "center", transition: "box-shadow 0.3s ease" }}>
              <MessageSquare size={48} style={{ color: "var(--color-secondary)", margin: "0 auto var(--spacing-4)" }} />
              <h4 style={{ fontWeight: 600, color: "var(--color-foreground)", marginBottom: "var(--spacing-2)" }}>Personalization</h4>
              <p style={{ fontSize: "0.875rem", color: "var(--color-muted-foreground)" }}>Adaptive messaging with student context</p>
            </Card>
            <Card style={{ padding: "var(--spacing-6)", boxShadow: "var(--shadow-md)", textAlign: "center", transition: "box-shadow 0.3s ease" }}>
              <Sparkles size={48} style={{ color: "var(--color-accent)", margin: "0 auto var(--spacing-4)" }} />
              <h4 style={{ fontWeight: 600, color: "var(--color-foreground)", marginBottom: "var(--spacing-2)" }}>Continuous Learning</h4>
              <p style={{ fontSize: "0.875rem", color: "var(--color-muted-foreground)" }}>System improves through feedback and patterns</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container cta-content">
          <h2 className="cta-title">Ready to Reclaim Your Time?</h2>
          <p className="cta-description">
            Join thousands of teachers who have automated their parent communications and regained hours each week for what matters most: teaching
          </p>
          <Link to="/dashboard">
            <Button variant="hero" size="lg" style={{ backgroundColor: "white", color: "var(--color-primary)" }}>
              Start Free Trial
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "600px",
              height: "600px",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: "9999px",
              filter: "blur(60px)",
            }}
          ></div>
        </div>
      </section>
    </div>
  );
};

export default Index;