/** Local Imports */
import StatCard from "../stat-card/stat-card";

/** Main Export */
const Assessment = ({ attemptId, initialIP, currentIP, duration, onEnd }) => (

    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-slate-100">
            <StatCard label="Attempt ID" value={attemptId} />
            <StatCard label="Initial IP" value={initialIP} />
            <StatCard label="Current IP" value={currentIP} highlight />
            <StatCard label="Duration" value={duration} />
        </div>
        <div className="mt-8">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Sample Assessment</h3>
            <div className="space-y-4">
                <label className="block text-slate-700 font-medium">1. What is the capital of France?</label>
                <textarea rows="2" className="w-full p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
            </div>
        </div>
        <div className="w-full flex justify-end">
        <button
            onClick={onEnd}
            className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 
                            text-white font-bold rounded-xl transition-all transform hover:scale-105 
                            shadow-lg active:scale-95
                            cursor-pointer"
        >
            End Assessment
        </button>
        </div>
    </div>
);
export default Assessment;