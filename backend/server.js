/** Libraries  */
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

/** Express App */
const app = express();
app.use(cors());
app.use(express.json());
const attempts = {};

/** start-attempt */
app.post("/start-attempt", (req, res) => {
  const attemptId = uuidv4();

  const ipAddress =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const timestamp = new Date().toISOString();

  attempts[attemptId] = {
    attemptId,
    initialIP: ipAddress,
    createdAt: timestamp,
    logs: [],
    ipChanges: [],
  };

  console.log("New attempt started:", attemptId);

  res.json({
    attemptId,
    ipAddress,
    timestamp,
  });
});

/** check-ip */
app.get("/check-ip/:attemptId", (req, res) => {
  const { attemptId } = req.params;

  if (!attempts[attemptId]) {
    return res.status(404).json({ message: "Attempt not found" });
  }

  const currentIP =
    req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const initialIP = attempts[attemptId].initialIP;

  const ipChanged = currentIP !== initialIP;

  res.json({
    currentIP,
    ipChanged,
  });
});

/** log-events */
app.post("/log-events/:attemptId", (req, res) => {
  const { attemptId } = req.params;
  const { events } = req.body;

  if (!attempts[attemptId]) {
    return res.status(404).json({ message: "Attempt not found" });
  }

  if (!events || !Array.isArray(events)) {
    return res.status(400).json({ message: "Invalid events format" });
  }

  // Store each event with server timestamp
  events.forEach((event) => {
    const storedEvent = {
      ...event,
      receivedAt: new Date().toISOString(),
    };

    attempts[attemptId].logs.push(storedEvent);

    if (event.type === "IP_CHANGE_DETECTED") {
      attempts[attemptId].ipChanges.push(storedEvent);
    }
  });

  console.log("Events stored for:", attemptId);

  res.json({ message: "Events stored successfully" });
});

/** get-attempt */
app.get("/attempt/:attemptId", (req, res) => {
  const { attemptId } = req.params;

  if (!attempts[attemptId]) {
    return res.status(404).json({ message: "Attempt not found" });
  }

  res.json(attempts[attemptId]);
});

/** Start Server */
app.listen(5000, () => {
  console.log("Secure Test Backend running on port 5000");
});