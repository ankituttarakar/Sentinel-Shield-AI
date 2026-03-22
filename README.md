# 🛡️ Sentinel AI: Cloud-Native Security Auditor

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini 2.5](https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=flat&logo=google&logoColor=white)](https://ai.google.dev/)

**Sentinel AI** is a high-performance, AI-driven code auditing platform designed to identify security vulnerabilities and logic flaws in real-time. By leveraging **Google Gemini 2.5 Flash**, it provides deep contextual analysis, risk distribution scoring, and actionable remediation steps within a professional, dark glass-morphism dashboard.

---

## ✨ Core Features

* **🔍 Real-Time AI Auditing:** Instantly scans source code for security threats (SQLi, XSS, CSRF) using the Gemini 2.5 Flash LLM.
* **📊 Dynamic Risk Scoring:** Automatically categorizes findings into **Critical, High, Medium, and Low** risk levels.
* **💾 Persistence & History:** Full **MongoDB integration** allows users to save, track, and manage past analysis reports.
* **📈 Visual Distribution:** Interactive **StatCharts** (built with Recharts) providing a visual breakdown of vulnerability density.
* **🗑️ Sidebar Management:** Streamlined navigation between historical scans with built-in **Sidebar Delete** functionality.
* **💎 Modern UI:** Responsive React dashboard featuring a clean "Glass-morphism" aesthetic and optimized performance.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js (Vite), Tailwind CSS, Recharts, Lucide Icons |
| **Backend** | Node.js, Express.js |
| **AI Engine** | Google Generative AI SDK (Gemini 2.5 Flash) |
| **Database** | MongoDB (Mongoose ODM) |
| **Env Mgmt** | Dotenv, Path-resolve |

---

## 📂 Project Structure

```text
Sentinel-Shield-AI/
├── client/                # React Frontend (Vite)
│   ├── src/
│   │   ├── components/    # StatChart, Sidebar, CodeInput
│   │   ├── pages/         # Dashboard.jsx
│   │   └── App.jsx        # Routing & Global Layout
├── server/                # Node.js Backend
│   ├── controllers/       # reviewController.js (Logic & DB Ops)
│   ├── models/            # Review.js (Mongoose Schema)
│   ├── routes/            # API Endpoints
│   ├── services/          # aiService.js (Gemini SDK Integration)
│   └── server.js          # Main Entry Point
└── .env                   # Environment Variables
```
-----

## ⚙️ Installation & Setup

### 1\. Clone & Install

```bash
git clone https://github.com/ankituttarakar/Sentinel-Shield-AI.git
cd Sentinel-Shield-AI
```

### 2\. Configure Environment

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
```

### 3\. Run the Application

**Terminal 1 (Backend):**

```bash
cd server
npm install
npm start
```

**Terminal 2 (Frontend):**

```bash
cd client
npm install
npm run dev
```

-----

## 🧪 Quick Start Demo

To verify the system is working, paste this vulnerable snippet into the editor:

```javascript
app.get('/api/user', (req, res) => {
  const query = "SELECT * FROM users WHERE id = " + req.query.id; // SQL Injection
  db.query(query, (err, result) => {
    res.send(result); // Sensitive Data Exposure
  });
});
```

-----

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

**Developed by Ankit Uttarakar**
