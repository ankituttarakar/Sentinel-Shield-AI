import React from 'react';

const Sidebar = ({ reviews, onSelect, onDelete, currentId }) => {
  return (
    <aside className="w-72 bg-slate-950 border-r border-slate-800 flex flex-col h-[calc(100vh-64px)]">
      <div className="p-6">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Analysis History</h2>
        <div className="space-y-2 overflow-y-auto max-h-[75vh] pr-2 custom-scrollbar">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-600 italic">No recent scans...</p>
          ) : (
            reviews.map((item) => (
              <div key={item._id} className="relative group">
                <button
                  onClick={() => onSelect(item)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 border ${
                    currentId === item._id 
                      ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                      : 'border-transparent hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <p className={`text-sm font-mono truncate pr-6 ${currentId === item._id ? 'text-blue-400' : 'text-slate-300'}`}>
                    {item.code.substring(0, 30)}...
                  </p>
                  <span className="text-[10px] text-slate-500 uppercase mt-2 block tracking-tighter">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </button>
                
                {/* ✅ Delete Action Icon */}
                <button
                  onClick={(e) => { 
                    e.stopPropagation(); // Prevents selection trigger
                    onDelete(item._id); 
                  }}
                  className="absolute right-3 top-4 opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Delete Entry"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;