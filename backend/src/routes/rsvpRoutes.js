const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    createRsvp,
    getMyRsvps,
    /*cancelRsvp,*/
    updateRsvp
} = require("../controllers/rsvpController");

router.post("/", authMiddleware, createRsvp);

router.get("/my", authMiddleware, getMyRsvps);

router.put(
    "/:eventId",
    authMiddleware,
    updateRsvp
);

/*router.delete(
    "/:id",
    authMiddleware,
    cancelRsvp
);*/

module.exports = router;