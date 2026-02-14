/** React Imports */
import { useState, useEffect, useRef } from "react";

/** Library Imports */
import { toast } from "react-toastify";
import axios from "axios";

/** Main Export Hook */
const UseSecureEnvironment = (isStarted) => {

  const [attemptId, setAttemptId] = useState(null);
  const [initialIP, setInitialIP] = useState(null);
  const [currentIP, setCurrentIP] = useState(null);
  const [eventQueue, setEventQueue] = useState([]);
  const [duration, setDuration] = useState(0);
  const queueRef = useRef([]);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  /** Toast Helpers*/
  const showWarning = (msg) => {
    toast.warning(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
    });
  };

  /** Keep queueRef synced + persist locally */
  useEffect(() => {
    queueRef.current = eventQueue;
    localStorage.setItem("eventQueue", JSON.stringify(eventQueue));
  }, [eventQueue]);

  /** Load stored queue (offline recovery) */
  useEffect(() => {
    const saved = localStorage.getItem("eventQueue");
    if (saved) {
      setEventQueue(JSON.parse(saved));
    }
  }, []);

  /**Start Attempt (Only after Start clicked)*/
  useEffect(() => {
    if (!isStarted) return;

    const startAttempt = async () => {
      try {
        const response = await axios.post(
          `${API_BASE}/start-attempt`
        );

        setAttemptId(response.data.attemptId);
        setInitialIP(response.data.ipAddress);
        setCurrentIP(response.data.ipAddress);

        // Enter fullscreen
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        }

      } catch (error) {
        console.error("Error starting attempt:", error);
      }
    };

    startAttempt();
  }, [isStarted]);

  /**IP Monitoring (Every 10 seconds)*/
  useEffect(() => {
    if (!attemptId || !isStarted) return;

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `${API_BASE}/check-ip/${attemptId}`
        );

        const newIP = response.data.currentIP;

        if (newIP !== initialIP) {

          showWarning("Network change detected. The session continues under monitoring.");
          setEventQueue((prev) => [
            ...prev,
            {
              type: "IP_CHANGE_DETECTED",
              oldIP: initialIP,
              newIP: newIP,
              timestamp: new Date().toISOString(),
            },
          ]);
        }

        setCurrentIP(newIP);

      } catch (error) {
        console.error("IP check failed:", error);
      }
    }, 10000);

    return () => clearInterval(interval);

  }, [attemptId, initialIP, isStarted]);

  /**Browser Monitoring Layer*/
  useEffect(() => {
    if (!attemptId || !isStarted) return;

    const logEvent = (eventType) => {

      const messages = {
        TAB_SWITCH: "Tab switch detected.",
        FULLSCREEN_EXIT: "Fullscreen mode exited.",
        COPY_ATTEMPT: "Copy action detected.",
        PASTE_ATTEMPT: "Paste action detected.",
      };

      // Minor violations → warning
      if (messages[eventType]) {
        showWarning(messages[eventType]);
      }

      setEventQueue((prev) => [
        ...prev,
        {
          type: eventType,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) logEvent("TAB_SWITCH");
    };

    const handleBlur = () => logEvent("WINDOW_BLUR");

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logEvent("FULLSCREEN_EXIT");
      }
    };

    const handleCopy = () => logEvent("COPY_ATTEMPT");
    const handlePaste = () => logEvent("PASTE_ATTEMPT");

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("copy", handleCopy);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("paste", handlePaste);
    };

  }, [attemptId, isStarted]);

  /**Batch Sender (Every 5 seconds)*/
  useEffect(() => {
    if (!attemptId || !isStarted) return;

    const interval = setInterval(async () => {

      if (queueRef.current.length === 0) return;

      try {
        await axios.post(
          `${API_BASE}/log-events/${attemptId}`,
          { events: queueRef.current }
        );

        setEventQueue([]);
        localStorage.removeItem("eventQueue");

      } catch (error) {
        console.error("Batch send failed:", error);
      }

    }, 5000);

    return () => clearInterval(interval);

  }, [attemptId, isStarted]);

  /** Timer */
  useEffect(() => {
    if (!isStarted) return;

    const interval = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isStarted]);

  /* Utility to format duration in HH:MM:SS */
  const FormatTime = (seconds) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  return {
    attemptId,
    initialIP,
    currentIP,
    formattedDuration: FormatTime(duration)
  };
};

export default UseSecureEnvironment;