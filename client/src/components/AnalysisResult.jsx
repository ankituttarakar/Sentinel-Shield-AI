import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const AnalysisResult = ({ result }) => {
  if (!result) return null;

  return (
    <div className="mt-12 bg-slate-900/40 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl animate-slide-up">
      {/* Glassy Header */}
      <div className="px-8 py-5 bg-gradient-to-r from-slate-800/50 to-transparent border-b border-slate-700/50 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]"></div>
          <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-400">Sentinel Security Audit</h3>
        </div>
        <div className="px-3 py-1 rounded-md bg-slate-950 text-[10px] font-mono text-slate-500 border border-slate-800">
          REPORT_ID: {result._id?.toString().slice(-8).toUpperCase()}
        </div>
      </div>

      <div className="p-8 lg:p-16">
        {/* The Prose block handles all the spacing (the 'cramped' fix) */}
        <div className="prose prose-invert prose-blue max-w-none 
          prose-p:text-slate-400 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-8
          prose-headings:text-white prose-headings:tracking-tight prose-headings:mt-16 prose-headings:mb-6
          prose-h2:text-3xl prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-4
          prose-strong:text-emerald-400 prose-strong:font-bold
          prose-ul:space-y-4 prose-li:text-slate-300
          prose-hr:border-slate-800 prose-hr:my-16">
          
          <ReactMarkdown
            components={{
              // This makes the code inside the AI's review look like a real IDE
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="my-8 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                    <div className="bg-slate-800 px-4 py-2 flex gap-1.5 border-b border-slate-700">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                    </div>
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ margin: 0, padding: '1.5rem', background: '#020617', fontSize: '0.9rem' }}
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded font-mono text-sm" {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {result.review}
          </ReactMarkdown>
        </div>
      </div>

      <div className="px-10 py-6 bg-slate-950/60 border-t border-slate-800/50 flex justify-between items-center">
        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">End of Document</span>
        <button 
          onClick={() => window.print()}
          className="text-[10px] text-blue-500 hover:text-blue-400 uppercase tracking-widest font-bold transition-colors"
        >
          Print Audit Log
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;