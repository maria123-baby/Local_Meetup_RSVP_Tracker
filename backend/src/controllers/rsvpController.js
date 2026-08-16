const db = require("../config/db");

const createRsvp = (req, res) => {
    const user_id = req.user.id;
    const { event_id, status } = req.body;

    if (!event_id || !status) {
        return res.status(400).json({
            success: false,
            message: "Event and RSVP status are required"
        });
    }

    // Check whether event exists and has seats
    const eventSql = `
        SELECT id, available_seats
        FROM events
        WHERE id = ?
    `;

    db.query(eventSql, [event_id], (err, events) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Failed to check event"
            });
        }

        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        if (events[0].available_seats <= 0) {
            return res.status(400).json({
                success: false,
                message: "No seats available"
            });
        }

        // Check whether user already RSVP'd
        const checkSql = `
            SELECT id
            FROM rsvps
            WHERE user_id = ? AND event_id = ?
        `;

        db.query(
            checkSql,
            [user_id, event_id],
            (err, existing) => {

                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        success: false,
                        message: "Failed to check RSVP"
                    });
                }

                if (existing.length > 0) {
                    return res.status(409).json({
                        success: false,
                        message: "You have already RSVP'd to this event"
                    });
                }

                // Create RSVP
                const insertSql = `
                    INSERT INTO rsvps
                    (user_id, event_id, status)
                    VALUES (?, ?, ?)
                `;

                db.query(
                    insertSql,
                    [user_id, event_id, status],
                    (err, result) => {

                        if (err) {
                            console.error(
                                "Error creating RSVP:",
                                err
                            );

                            return res.status(500).json({
                                success: false,
                                message: "Failed to create RSVP"
                            });
                        }

                        // Decrease available seats
                        const updateSql = `
                            UPDATE events
                            SET available_seats = available_seats - 1
                            WHERE id = ?
                        `;

                        db.query(
                            updateSql,
                            [event_id],
                            (err) => {

                                if (err) {
                                    console.error(
                                        "Error updating seats:",
                                        err
                                    );

                                    return res.status(500).json({
                                        success: false,
                                        message:
                                            "RSVP created but failed to update seats"
                                    });
                                }

                                res.status(201).json({
                                    success: true,
                                    message:
                                        "RSVP created successfully",
                                    rsvpId: result.insertId
                                });
                            }
                        );
                    }
                );
            }
        );
    });
};

const getMyRsvps = (req, res) => {
    const user_id = req.user.id;

    const sql = `
        SELECT
            r.id,
            r.event_id,
            r.status,
            r.created_at,
            e.title,
            e.description,
            e.location,
            e.event_date
        FROM rsvps r
        JOIN events e
            ON r.event_id = e.id
        WHERE r.user_id = ?
        ORDER BY e.event_date ASC
    `;

    db.query(
        sql,
        [user_id],
        (err, results) => {

            if (err) {
                console.error(
                    "Error fetching RSVPs:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch RSVPs"
                });
            }

            return res.status(200).json({
                success: true,
                rsvps: results
            });
        }
    );
};
const updateRsvp = (req, res) => {
    const user_id = req.user.id;
    const event_id = req.params.eventId;
    const { status } = req.body;

    const validStatuses = ["going", "maybe", "declined"];

    if (!status) {
        return res.status(400).json({
            success: false,
            message: "RSVP status is required"
        });
    }

    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid RSVP status"
        });
    }

    const findSql = `
        SELECT status
        FROM rsvps
        WHERE user_id = ? AND event_id = ?
    `;

    db.query(
        findSql,
        [user_id, event_id],
        (err, results) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to find RSVP"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "RSVP not found"
                });
            }

            const oldStatus = results[0].status;

            // No change
            if (oldStatus === status) {
                return res.json({
                    success: true,
                    message: "RSVP status unchanged"
                });
            }

            // Going -> Maybe / Not Going
            if (oldStatus === "going" && status !== "going") {

                const updateRsvpSql = `
                    UPDATE rsvps
                    SET status = ?
                    WHERE user_id = ? AND event_id = ?
                `;

                db.query(
                    updateRsvpSql,
                    [status, user_id, event_id],
                    (err) => {

                        if (err) {
                            console.error(err);

                            return res.status(500).json({
                                success: false,
                                message: "Failed to update RSVP"
                            });
                        }

                        const updateSeatSql = `
                            UPDATE events
                            SET available_seats =
                                available_seats + 1
                            WHERE id = ?
                        `;

                        db.query(
                            updateSeatSql,
                            [event_id],
                            (err) => {

                                if (err) {
                                    console.error(err);

                                    return res.status(500).json({
                                        success: false,
                                        message:
                                            "Failed to update available seats"
                                    });
                                }

                                return res.json({
                                    success: true,
                                    message:
                                        "RSVP updated successfully"
                                });
                            }
                        );
                    }
                );

                return;
            }

            // Maybe / Not Going -> Going
            if (oldStatus !== "going" && status === "going") {

                const checkSeatsSql = `
                    SELECT available_seats
                    FROM events
                    WHERE id = ?
                `;

                db.query(
                    checkSeatsSql,
                    [event_id],
                    (err, events) => {

                        if (err) {
                            console.error(err);

                            return res.status(500).json({
                                success: false,
                                message: "Failed to check seats"
                            });
                        }

                        if (events.length === 0) {
                            return res.status(404).json({
                                success: false,
                                message: "Event not found"
                            });
                        }

                        if (events[0].available_seats <= 0) {
                            return res.status(400).json({
                                success: false,
                                message: "No seats available"
                            });
                        }

                        const updateRsvpSql = `
                            UPDATE rsvps
                            SET status = ?
                            WHERE user_id = ? AND event_id = ?
                        `;

                        db.query(
                            updateRsvpSql,
                            [status, user_id, event_id],
                            (err) => {

                                if (err) {
                                    console.error(err);

                                    return res.status(500).json({
                                        success: false,
                                        message:
                                            "Failed to update RSVP"
                                    });
                                }

                                const updateSeatSql = `
                                    UPDATE events
                                    SET available_seats =
                                        available_seats - 1
                                    WHERE id = ?
                                `;

                                db.query(
                                    updateSeatSql,
                                    [event_id],
                                    (err) => {

                                        if (err) {
                                            console.error(err);

                                            return res.status(500).json({
                                                success: false,
                                                message:
                                                    "Failed to update seats"
                                            });
                                        }

                                        return res.json({
                                            success: true,
                                            message:
                                                "RSVP updated successfully"
                                        });
                                    }
                                );
                            }
                        );
                    }
                );

                return;
            }

            // Maybe -> Not Going
            // Not Going -> Maybe
            const updateSql = `
                UPDATE rsvps
                SET status = ?
                WHERE user_id = ? AND event_id = ?
            `;

            db.query(
                updateSql,
                [status, user_id, event_id],
                (err) => {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to update RSVP"
                        });
                    }

                    return res.json({
                        success: true,
                        message: "RSVP updated successfully"
                    });
                }
            );
        }
    );
};

module.exports = {
    createRsvp,
    getMyRsvps,
    updateRsvp
};