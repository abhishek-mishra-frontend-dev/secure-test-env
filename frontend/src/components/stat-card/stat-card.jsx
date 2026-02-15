/** Main Export */
const StatCard = ({ label, value, highlight }) => (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
        <p className="text-xs text-slate-400 uppercase font-bold">{label}</p>
        <p className={`text-sm font-mono ${highlight ? 'text-indigo-600' : 'text-slate-700'}`}>{value}</p>
    </div>
);
export default StatCard;