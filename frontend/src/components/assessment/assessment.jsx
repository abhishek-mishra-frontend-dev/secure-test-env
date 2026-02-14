/** Local Imports */
import StatCard from "../stat-card/stat-card";

/** Main Export */
const Assessment = ({ attemptId, initialIP, currentIP, duration }) => (

    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-slate-100">
            <StatCard label="Attempt ID" value={attemptId} />
            <StatCard label="Initial IP" value={initialIP} />
            <StatCard label="Current IP" value={currentIP} highlight />
            <StatCard label="Duration" value={duration} />
        </div>
        <div className="mt-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Sample Assessment</h3>
            <div className="space-y-4">
                <label className="block text-slate-700 font-medium">1. What is the capital of France?</label>
                <textarea rows="4" className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
            </div>
        </div>
    </div>
);
export default Assessment;