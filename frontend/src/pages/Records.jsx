import React, { useState, useEffect } from "react";
import api from "../services/api";
import AttendanceTable from "../components/AttendanceTable";

export default function Records() {
  const [records, setRecords] = useState([]);
  const [absentees, setAbsentees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("present");

  const fetchData = async () => {
    setLoading(true);

    const [recordsData, absenteesData] = await Promise.all([
      api.getRecords(),
      api.getAbsentees(),
    ]);

    // ✅ Handle root + fix id mapping
    const recordsList = recordsData?.root || recordsData || [];
    const absenteesList = absenteesData?.root || absenteesData || [];

    setRecords(recordsList);
    setAbsentees(absenteesList);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="header-font text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-2">
            Attendance Logs
          </h1>
          <p className="text-on-surface-variant font-body">
            Real-time verification history and absentee monitoring.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl border border-outline-variant/50 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 flex flex-col md:flex-row md:items-center justify-between border-b border-outline-variant/30 gap-4">
            <div className="flex bg-surface-container-low p-1 rounded-lg w-full md:w-auto">
              <button
                onClick={() => setActiveTab("present")}
                className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === "present" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Present ({records.length})
              </button>

              <button
                onClick={() => setActiveTab("absent")}
                className={`flex-1 md:flex-none px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === "absent" ? "bg-error/10 text-error shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Absent ({absentees.length})
              </button>
            </div>

            <button
              onClick={fetchData}
              className="px-4 py-2 bg-surface-container-low text-on-surface font-semibold rounded-lg hover:bg-surface-container-high active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>{" "}
              Refresh Data
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 font-label text-sm animate-pulse">
              Syncing institutional ledger...
            </div>
          ) : activeTab === "present" ? (
            <AttendanceTable records={records} />
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-error/5">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-error/10">
                      Name
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-error/10">
                      Roll Number
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-error/10">
                      Department
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant border-b border-error/10 text-right">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-outline-variant/10">
                  {absentees.map((student, i) => (
                    <tr
                      key={i}
                      className="group hover:bg-error/5 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 font-semibold text-on-surface">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 font-body text-sm text-on-surface-variant">
                        {student.student_id || student.id}
                      </td>
                      <td className="px-6 py-4 font-body text-sm text-on-surface-variant">
                        {student.department}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-white border-l-2 shadow-sm border-error text-error">
                          Absent
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
