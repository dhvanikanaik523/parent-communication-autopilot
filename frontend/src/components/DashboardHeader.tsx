import { Button } from "./Button";
import { Badge } from "./Badge";
import { Bell, Settings, User } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <header className="dashboard-header">
      <div className="container">
        <div className="dashboard-header-content">
          <div className="dashboard-logo">
            <div className="dashboard-logo-icon">
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.125rem' }}>AI</span>
            </div>
            <div>
              <h1 className="dashboard-logo-text">Parent Comm Autopilot</h1>
              <p className="dashboard-logo-subtitle">Teacher Dashboard</p>
            </div>
          </div>

          <div className="dashboard-actions">
            <div style={{ position: 'relative' }}>
              <Button variant="ghost" size="icon">
                <Bell size={20} />
              </Button>
              <Badge 
                variant="warning" 
                style={{ 
                  position: 'absolute', 
                  top: '-4px', 
                  right: '-4px', 
                  width: '20px', 
                  height: '20px', 
                  padding: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                3
              </Badge>
            </div>
            <Button variant="ghost" size="icon">
              <Settings size={20} />
            </Button>
            <Button variant="ghost" size="icon">
              <User size={20} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
