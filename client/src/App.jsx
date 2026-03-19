import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="layout">

        {/* 🧭 Sidebar */}
        <aside className="sidebar">
          <h2>🛡 Sentinel AI</h2>
          <ul>
            <li>Dashboard</li>
            <li>History</li>
            <li>Reports</li>
          </ul>
        </aside>

        {/* 📄 Main Content */}
        <div className="main">
          <header className="header">
            Security Analysis System
          </header>

          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export default App;