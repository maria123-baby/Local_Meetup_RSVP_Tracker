const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const rsvpRoutes = require("./routes/rsvpRoutes");
const app = express();
const db = require("./config/db");
require("dotenv").config();
app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/rsvps", rsvpRoutes);
app.get("/api/tracker", (req, res) => {
  res.json({
    message: "Local Meetup RSVP Tracker backend is running",
  });
});


app.post("/api/events/:id/rsvp", (req, res) => {
  const eventId = req.params.id;
  const { userId, status } = req.body;

  if (!userId || !status) {
    return res.status(400).json({
      message: "userId and status are required",
    });
  }

  res.json({
    message: "RSVP successful",
    rsvp: {
      eventId,
      userId,
      status,
    },
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});