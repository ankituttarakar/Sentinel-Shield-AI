import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AnalysisResult = ({ result }) => {
  if (!result) return null;

  const formatReview = (review) => {
    if (typeof review === "string") return review;

    if (typeof review === "object") {
      let output = "";

      if (review.summary) {
        output += `## Summary\n${review.summary}\n\n`;
      }

      if (review.vulnerabilities?.length) {
        output += `## Vulnerabilities\n`;
        review.vulnerabilities.forEach(v => {
          output += `- **${v.type} (${v.severity})**\n  - ${v.description}\n  - Fix: ${v.fix}\n\n`;
        });
      }

      if (review.improvements?.length) {
        output += `## Improvements\n`;
        review.improvements.forEach(i => {
          output += `- ${i}\n`;
        });
        output += "\n";
      }

      return output;
    }

    return "No analysis available.";
  };

  const reviewText = formatReview(result.review);

  return (
    <div className="mt-12 bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">

      {/* HEADER */}
      <div className="px-8 py-5 bg-gradient-to-r from-slate-800/50 to-transparent border-b border-slate-700/50 flex justify-between items-center">
        
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-400">
            Sentinel Security Audit
          </h3>
        </div>

        <div className="flex items-center gap-3">

          {/* ✅ REPORT ID */}
          <div className="px-3 py-1 rounded-md bg-slate-950 text-[10px] font-mono text-slate-500 border border-slate-800">
            REPORT_ID: {result._id?.toString().slice(-8).toUpperCase()}
          </div>

          {/* 🔥 NEW RISK BADGE */}
          <div className={`px-3 py-1 rounded-md text-[10px] font-bold border ${
            result.risk === "CRITICAL" ? "bg-red-500/20 text-red-400 border-red-500/30" :
            result.risk === "HIGH" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
            result.risk === "MEDIUM" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
            "bg-green-500/20 text-green-400 border-green-500/30"
          }`}>
            {result.risk}
          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div className="p-8 lg:p-16">
        <div className="prose prose-invert prose-blue max-w-none">

          <ReactMarkdown
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="my-8 rounded-2xl overflow-hidden border border-slate-700">
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">
                    {children}
                  </code>
                );
              },
            }}
          >
            {reviewText}
          </ReactMarkdown>

        </div>
      </div>

      {/* FOOTER */}
      <div className="px-10 py-6 bg-slate-950/60 border-t border-slate-800/50 flex justify-between items-center">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          End of Document
        </span>
        <button 
          onClick={() => window.print()}
          className="text-[10px] text-blue-500 hover:text-blue-400 uppercase tracking-widest font-bold"
        >
          Print Audit Log
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;