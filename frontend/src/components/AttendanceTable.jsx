import React from "react";

export default function AttendanceTable({ records }) {
  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low/50">
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/20">
              Name
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/20">
              Roll Number
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/20">
              Date
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/20">
              Time
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/20 text-right">
              Status
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-outline-variant/10">
          {records.map((rec, i) => (
            <tr
              key={i}
              className="group hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <td className="px-6 py-4 font-semibold text-on-surface">
                {rec.name}
              </td>

              {/* ✅ ONLY FIX */}
              <td className="px-6 py-4 font-body text-sm text-on-surface-variant">
                {rec.student_id || rec.id}
              </td>

              <td className="px-6 py-4 font-body text-sm text-on-surface-variant">
                {rec.date}
              </td>
              <td className="px-6 py-4 font-body text-sm font-medium text-on-surface">
                {rec.time}
              </td>

              <td className="px-6 py-4 text-right">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-white border-l-2 shadow-sm ${rec.status === "Verified" ? "border-[#22C55E] text-[#22C55E]" : "border-[#BA1A1A] text-[#BA1A1A]"}`}
                >
                  {rec.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
