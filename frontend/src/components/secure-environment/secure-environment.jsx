/** React Imports */
import React, { useState } from 'react';

/** Local Imports */
import UseSecureEnvironment from '../../hook/use-secure-environment';

/** Components */
import Assessment from '../assessment/assessment';

const SecureEnvironment = () => {

    const [isStarted, setIsStarted] = useState(false);
    const { attemptId, initialIP, currentIP, formattedDuration } = UseSecureEnvironment(isStarted);

    const handleStart = () => {
        setIsStarted(true);
    };

    return (
        <div className="max-w-3xl mx-auto bg-white shadow-minimal rounded-3xl overflow-hidden">
            <div className="bg-sky-800 px-8 py-6">
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                    <span className="h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                    Secure Test Environment
                </h1>
            </div>

            <div className="p-8">
                {!isStarted && (
                    <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded-md text-sm">
                        Please remain in Fullscreen and avoid Switching Tabs during the assessment.
                    </div>
                )}

                {!isStarted ? (
                    <div className="text-center py-10">
                        <div className="mb-6">
                            <div className="inline-flex items-center justify-center p-4 bg-sky-100 rounded-full mb-4">
                                <svg className="h-8 w-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800">Ready to begin?</h2>
                            <p className="text-slate-500 mt-2">Your session will be monitored for security purposes.</p>
                        </div>
                        <button
                            onClick={handleStart}
                            className="
                            w-full sm:w-auto px-8 py-3 bg-sky-600 hover:bg-sky-700 
                            text-white font-bold rounded-xl transition-all transform hover:scale-105 
                            shadow-lg active:scale-95
                            cursor-pointer"
                        >
                            Start Assessment
                        </button>
                    </div>
                ) : attemptId ? (
                    <Assessment
                        attemptId={attemptId}
                        initialIP={initialIP}
                        currentIP={currentIP}
                        duration={formattedDuration}
                    />
                ) : (
                    <p className="text-center text-slate-500">
                        Initializing secure session...
                    </p>
                )}
            </div>
        </div>
    );
};

export default SecureEnvironment;