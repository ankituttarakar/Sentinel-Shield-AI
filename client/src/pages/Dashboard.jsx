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

  // 1. FETCH HISTORY ON LOAD
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/reviews");
        const data = await res.json();
        if (res.ok) setReviews(data || []);
      } catch (err) {
        console.error("Fetch failed", err);
      }
    };
    fetchReviews();
  }, []);

  // 2. DELETE HANDLER (Syncs Sidebar + Main View)
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this scan permanently?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/review/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        // Remove from Sidebar list
        setReviews(prev => prev.filter(item => item._id !== id));
        // If we are currently viewing the deleted item, clear the screen
        if (currentAnalysis?._id === id) {
          setCurrentAnalysis(null);
          setCode("");
        }
      }
    } catch {
      alert("Delete operation failed.");
    }
  };

  // 3. ANALYZE HANDLER (Handles JSON structure)
  const handleAnalyze = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setCurrentAnalysis(null); // Clear old results while loading

    try {
      const response = await fetch('http://localhost:5000/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");

      // Construct the formatted object for the UI
      const formatted = {
        _id: data.id,
        code: code,
        review: data.review, // Contains summary, vulnerabilities, improvements
        risk: data.risk,
        createdAt: new Date().toISOString()
      };

      setCurrentAnalysis(formatted);
      setReviews(prev => [formatted, ...prev]); // Prepend to history

    } catch (err) {
      alert("Audit Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR: Pass props for history and selection */}
        <Sidebar 
          reviews={reviews} 
          currentId={currentAnalysis?._id}
          onSelect={(item) => { 
            setCurrentAnalysis(item); 
            setCode(item.code); 
          }}
          onDelete={handleDelete}
        />

        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-7xl mx-auto">
            <header className="mb-10">
              <h2 className="text-4xl font-black text-white tracking-tight">
                Sentinel Intelligence
              </h2>
              <p className="text-slate-400 mt-2 text-sm">Powered by Gemini 2.5 Flash</p>
            </header>

            <CodeInput
              code={code}
              setCode={setCode}
              onAnalyze={handleAnalyze}
              loading={loading}
            />

            {currentAnalysis && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-12 animate-in fade-in duration-500">
                
                {/* Main Audit Findings */}
                <div className="lg:col-span-2">
                  <AnalysisResult result={currentAnalysis} />
                </div>

                {/* Visuals Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Distribution Chart Card */}
                  <div className="bg-slate-900/40 backdrop-blur-md p-6 h-80 flex flex-col border border-slate-800 rounded-3xl shadow-xl">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-4 text-center tracking-widest">
                      Risk Distribution
                    </h3>
                    <div className="flex-1">
                      <StatChart vulnerabilities={currentAnalysis.review?.vulnerabilities} />
                    </div>
                  </div>

                  {/* Risk Badge Card */}
                  <div className="bg-slate-900/40 backdrop-blur-md p-8 border border-slate-800 rounded-3xl text-center shadow-xl">
                    <h4 className="text-xs uppercase mb-2 text-slate-500 font-bold tracking-widest">
                      Overall Risk
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