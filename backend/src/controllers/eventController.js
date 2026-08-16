const db = require("../config/db");

const createMeetup = (req, res) => {
    const {
        title,
        description,
        event_date,
        location,
        total_seats
    } = req.body;

    const created_by = req.user.id;

    // Validate required fields
    if (
        !title ||
        !description ||
        !event_date ||
        !location ||
        total_seats === undefined ||
        total_seats === null
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    // Validate number of seats
    if (!Number.isInteger(Number(total_seats)) || Number(total_seats) <= 0) {
        return res.status(400).json({
            success: false,
            message: "Total seats must be a positive number"
        });
    }

    const sql = `
        INSERT INTO events
        (
            title,
            description,
            event_date,
            location,
            total_seats,
            available_seats,
            created_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            title,
            description,
            event_date,
            location,
            Number(total_seats),
            Number(total_seats),
            created_by
        ],
        (err, result) => {

            if (err) {
                console.error(
                    "Error creating meetup:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to create meetup"
                });
            }

            return res.status(201).json({
                success: true,
                message: "Meetup created successfully",
                meetupId: result.insertId
            });
        }
    );
};



const getMeetups = (req, res) => {
    const sql = `
        SELECT *
        FROM events
        ORDER BY event_date ASC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching meetups:", err);

            return res.status(500).json({
                message: "Failed to fetch meetups"
            });
        }

        res.status(200).json({
            success: true,
            events: results
        });
    });
};
const updateEvent = (req, res) => {
    const event_id = req.params.id;
    const user_id = req.user.id;

    const {
        title,
        description,
        event_date,
        location,
        total_seats
    } = req.body;

    // Validate fields
    if (
        !title ||
        !description ||
        !event_date ||
        !location ||
        total_seats === undefined ||
        total_seats === null
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    if (Number(total_seats) <= 0) {
        return res.status(400).json({
            success: false,
            message: "Total seats must be greater than 0"
        });
    }

    // Check whether this user created the event
    const checkSql = `
        SELECT total_seats, available_seats
        FROM events
        WHERE id = ? AND created_by = ?
    `;

    db.query(
        checkSql,
        [event_id, user_id],
        (err, results) => {

            if (err) {
                console.error("Error checking event:", err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to check event"
                });
            }

            // Event doesn't belong to this user
            if (results.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: "You can only edit events you created"
                });
            }

            const event = results[0];

            // Calculate number of people currently going
            const goingCount =
                event.total_seats - event.available_seats;

            // Don't allow total seats below current going count
            if (Number(total_seats) < goingCount) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Total seats cannot be less than ${goingCount}`
                });
            }

            // Calculate new available seats
            const newAvailableSeats =
                Number(total_seats) - goingCount;

            const updateSql = `
                UPDATE events
                SET
                    title = ?,
                    description = ?,
                    event_date = ?,
                    location = ?,
                    total_seats = ?,
                    available_seats = ?
                WHERE id = ? AND created_by = ?
            `;

            db.query(
                updateSql,
                [
                    title,
                    description,
                    event_date,
                    location,
                    Number(total_seats),
                    newAvailableSeats,
                    event_id,
                    user_id
                ],
                (err, result) => {

                    if (err) {
                        console.error(
                            "Error updating event:",
                            err
                        );

                        return res.status(500).json({
                            success: false,
                            message: "Failed to update event"
                        });
                    }

                    return res.status(200).json({
                        success: true,
                        message: "Event updated successfully"
                    });
                }
            );
        }
    );
};
const deleteEvent = (req, res) => {
    const event_id = req.params.id;
    const user_id = req.user.id;

    const sql = `
        DELETE FROM events
        WHERE id = ? AND created_by = ?
    `;

    db.query(
        sql,
        [event_id, user_id],
        (err, result) => {

            if (err) {
                console.error(
                    "Error deleting event:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to delete event"
                });
            }

            // Event doesn't belong to this user
            if (result.affectedRows === 0) {
                return res.status(403).json({
                    success: false,
                    message:
                        "You can only delete events you created"
                });
            }

            return res.status(200).json({
                success: true,
                message: "Event deleted successfully"
            });
        }
    );
};

const getAttendees = (req, res) => {

    const eventId = req.params.eventId;

    const sql = `
        SELECT
            u.id,
            u.username,
            u.email
        FROM rsvps r
        JOIN users u
            ON r.user_id = u.id
        WHERE r.event_id = ?
        AND r.status = 'going'
    `;

    db.query(sql, [eventId], (err, results) => {

        if (err) {
            console.error("Error fetching attendees:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch attendees"
            });
        }

        res.json({
            success: true,
            attendees: results
        });
    });
};
module.exports = {
    createMeetup,
    getMeetups,
    getAttendees,
    updateEvent,
    deleteEvent
};