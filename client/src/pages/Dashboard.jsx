import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CodeInput from '../components/CodeInput';
import AnalysisResult from '../components/AnalysisResult';
import StatChart from '../components/StatChart';

const Dashboard = () => {
  const [code, setCode] = useState("");
  const [reviews, setReviews] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch History on Load
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reviews");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) setReviews(data);
        }
      } catch (err) {
        console.log("Fetch failed", err);
      }
    };
    fetchReviews();
  }, []);

  // Handle Item Deletion
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scan from history?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/review/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setReviews(prev => prev.filter(item => item._id !== id));
        if (currentAnalysis?._id === id) {
          setCurrentAnalysis(null);
          setCode("");
        }
      }
    } catch (err) {
      alert("Delete failed");
    }
  };

  const calculateAuditData = (text) => {
  if (!text) return { stats: [], finalScore: 0 };

  // Better detection (only count real severity)
  const crit = (text.match(/Critical Vulnerability|High Risk/gi) || []).length;
  const warn = (text.match(/Improvement|Warning|Recommendation/gi) || []).length;

  // base score
  let score = 90;

  score -= crit * 25;
  score -= warn * 5;

  score = Math.max(50, Math.min(100, score));

  return {
    stats: [
      { name: 'Critical', value: crit },
      { name: 'Warning', value: warn }
    ].filter(s => s.value > 0),
    finalScore: score
  };
};
  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      const formatted = { _id: data.id, code, review: data.review };
      setCurrentAnalysis(formatted);
      setReviews(prev => [formatted, ...prev]);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const auditData = calculateAuditData(currentAnalysis?.review);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          reviews={reviews} 
          currentId={currentAnalysis?._id}
          onSelect={(item) => { setCurrentAnalysis(item); setCode(item.code); }}
          onDelete={handleDelete}
        />
        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black text-white mb-10 tracking-tight">Sentinel Intelligence</h2>
            <CodeInput code={code} setCode={setCode} onAnalyze={handleAnalyze} loading={loading} />
            {currentAnalysis && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">
                <div className="lg:col-span-2"><AnalysisResult result={currentAnalysis} /></div>
                <div className="lg:col-span-1 space-y-6">
                  <div className="glass-panel p-6 h-80 flex flex-col border border-slate-800 rounded-3xl relative">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-4 text-center tracking-widest">Distribution</h3>
                    <div className="flex-1 w-full h-full min-h-0"><StatChart data={auditData.stats} /></div>
                  </div>
                  <div className="glass-panel p-8 border border-blue-500/20 bg-blue-500/5 rounded-3xl">
                    <h4 className="text-blue-400 font-bold text-xs uppercase mb-2">Audit Score</h4>
                    <p className="text-6xl font-black text-white">{auditData.finalScore}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;