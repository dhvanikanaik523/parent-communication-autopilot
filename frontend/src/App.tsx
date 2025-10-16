import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;