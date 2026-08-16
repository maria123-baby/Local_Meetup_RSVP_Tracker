const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    createMeetup,
    getMeetups,
    getAttendees,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

router.post("/",authMiddleware, createMeetup);
router.get("/", getMeetups);
router.put(
    "/:id",
    authMiddleware,
    updateEvent
);

router.delete(
    "/:id",
    authMiddleware,
    deleteEvent
);
router.get(
    "/:eventId/attendees",
    authMiddleware,
    getAttendees
);
module.exports = router;