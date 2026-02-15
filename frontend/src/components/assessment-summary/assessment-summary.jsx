/** React Imports */
import { useState } from "react";

/** Libraries */
import axios from "axios";

/** Main Export */
const AssessmentSummary = ({ attemptId, duration, onRestart }) => {

    const [logs, setLogs] = useState(null);
    const [showLogs, setShowLogs] = useState(false);

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const fetchLogs = async () => {
        try {
            const response = await axios.get(
                `${API_BASE}/attempt/${attemptId}`
            );
            setLogs(response.data);
            setShowLogs(true);
        } catch (error) {
            console.error("Error fetching logs:", error);
        }
    };

    const formatEventType = (type) => {
        return type
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString();
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-green-600">
                    Assessment Submitted Successfully
                </h2>
                <p className="mt-2 text-slate-600">
                    Attempt ID: <span className="font-semibold">{attemptId}</span>
                </p>
                <p className="text-slate-600">
                    Duration: <span className="font-semibold">{duration}</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button
                    onClick={fetchLogs}
                    className="w-full sm:w-auto px-8 py-3 bg-slate-200 hover:bg-slate-300 
                            text-sky-800 font-bold rounded-xl transition-all transform hover:scale-105 
                            shadow-lg active:scale-95
                            cursor-pointer"
                >
                    View Logs
                </button>
                <button
                    onClick={onRestart}
                    className="w-full sm:w-auto px-8 py-3 bg-sky-600 hover:bg-sky-700 
                            text-white font-bold rounded-xl transition-all transform hover:scale-105 
                            shadow-lg active:scale-95
                            cursor-pointer"
                >
                    Start New Assessment
                </button>
                </div>
            </div>

            {showLogs && logs && (
                <div className="mt-8 border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">
                        Event Logs ({logs.logs.length})
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {logs.logs.map((event, index) => (
                            <div
                                key={index}
                                className="p-3 bg-slate-50 rounded-xl text-sm border border-slate-200"
                            >
                                <p><strong>Type:</strong> {formatEventType(event.type)}</p>
                                <p><strong>Time:</strong> {formatDate(event.timestamp)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssessmentSummary;