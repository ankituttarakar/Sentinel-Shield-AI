import React from 'react';

const CodeInput = ({ code, setCode, onAnalyze, loading }) => {
  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here (Python, JS, C++...)"
        className="w-full h-64 p-6 bg-transparent text-slate-200 font-mono focus:outline-none resize-none"
      />
      <div className="p-4 bg-slate-900/50 border-t border-slate-800 flex justify-end">
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
        >
          {loading ? "Analyzing..." : "Run AI Review"}
        </button>
      </div>
    </div>
  );
};

export default CodeInput;