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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reviews");
        const data = await res.json();
        if (res.ok) setReviews(data || []);
      } catch (err) {
        console.log("Fetch failed", err);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this scan?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/review/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setReviews(prev => prev.filter(item => item._id !== id));
        if (currentAnalysis?._id === id) {
          setCurrentAnalysis(null);
          setCode("");
        }
      }
    } catch {
      alert("Delete failed");
    }
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
      if (!response.ok) throw new Error(data.error);

      const formatted = {
        _id: data.id,
        code,
        review: data.review,
        risk: data.risk,
        createdAt: new Date().toISOString()
      };

      setCurrentAnalysis(formatted);
      setReviews(prev => [formatted, ...prev]);

    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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

            <h2 className="text-4xl font-black text-white mb-10 tracking-tight">
              Sentinel Intelligence
            </h2>

            <CodeInput
              code={code}
              setCode={setCode}
              onAnalyze={handleAnalyze}
              loading={loading}
            />

            {currentAnalysis && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12">

                <div className="lg:col-span-2">
                  <AnalysisResult result={currentAnalysis} />
                </div>

                <div className="lg:col-span-1 space-y-6">

                  {/* 🔥 Distribution Chart */}
                  <div className="glass-panel p-6 h-80 flex flex-col border border-slate-800 rounded-3xl">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-4 text-center tracking-widest">
                      Distribution
                    </h3>

                    <div className="flex-1 w-full min-h-[250px]">
                      <StatChart data={
                        (currentAnalysis.review?.vulnerabilities || []).map(v => ({
                          name: v.severity,
                          value: 1
                        }))
                      } />
                    </div>
                  </div>

                  {/* ✅ NEW RISK LEVEL UI */}
                  <div className="glass-panel p-8 border border-slate-800 rounded-3xl text-center">
                    <h4 className="text-xs uppercase mb-2 text-slate-400">
                      Risk Level
                    </h4>

                    <p className={`text-5xl font-black ${
                      currentAnalysis.risk === "CRITICAL" ? "text-red-500" :
                      currentAnalysis.risk === "HIGH" ? "text-orange-400" :
                      currentAnalysis.risk === "MEDIUM" ? "text-yellow-400" :
                      "text-green-400"
                    }`}>
                      {currentAnalysis.risk}
                    </p>
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