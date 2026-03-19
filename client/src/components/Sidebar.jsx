import React from "react";

const Sidebar = ({ reviews, currentId, onSelect, onDelete }) => {
  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col">
      
      <div className="p-4 border-b border-slate-800">
        <h2 className="text-xs uppercase text-slate-400 tracking-widest">
          Analysis History
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">

        {reviews.length === 0 && (
          <p className="text-slate-500 text-sm p-4">
            No scans yet
          </p>
        )}

        {reviews.map((item) => (
          <div
            key={item._id}
            onClick={() => onSelect(item)}
            className={`p-4 border-b border-slate-800 cursor-pointer transition hover:bg-slate-800/50 ${
              currentId === item._id ? "bg-slate-800" : ""
            }`}
          >
            <div className="flex justify-between items-center">

              <p className="text-sm text-slate-200 truncate w-[70%]">
                {item.code?.slice(0, 30)}...
              </p>

              {/* ✅ RISK BADGE */}
              <span className={`text-[10px] px-2 py-1 rounded font-bold ${
                item.risk === "CRITICAL" ? "bg-red-500/20 text-red-400" :
                item.risk === "HIGH" ? "bg-orange-500/20 text-orange-400" :
                item.risk === "MEDIUM" ? "bg-yellow-500/20 text-yellow-400" :
                "bg-green-500/20 text-green-400"
              }`}>
                {item.risk || "LOW"}
              </span>

            </div>

            <div className="flex justify-between items-center mt-2">

              <p className="text-xs text-slate-500">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "Invalid Date"}
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item._id);
                }}
                className="text-xs text-red-500 hover:text-red-400"
              >
                Delete
              </button>

            </div>
          </div>
        ))}

      </div>
    </aside>
  );
};

export default Sidebar;