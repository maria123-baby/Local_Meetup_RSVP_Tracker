"use client";

import { useEffect, useState } from "react";

export default function CreateMeetup({
    isOpen,
    onClose,
    event = null,
    onUpdated
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [location, setLocation] = useState("");
    const [totalSeats, setTotalSeats] = useState("");

    const isEditMode = event !== null;

    // Fill form when editing
    useEffect(() => {
        if (event) {
            setTitle(event.title || "");
            setDescription(event.description || "");

            // Convert date to YYYY-MM-DD for date input
            setEventDate(
                event.event_date
                    ? event.event_date.substring(0, 10)
                    : ""
            );

            setLocation(event.location || "");
            setTotalSeats(event.total_seats || "");
        } else {
            // Empty form when creating
            setTitle("");
            setDescription("");
            setEventDate("");
            setLocation("");
            setTotalSeats("");
        }
    }, [event, isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            return;
        }

        try {
            const url = isEditMode
                ? `http://localhost:5000/api/events/${event.id}`
                : "http://localhost:5000/api/events";

            const method = isEditMode ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    description,
                    event_date: eventDate,
                    location,
                    total_seats: Number(totalSeats)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    `Failed to ${isEditMode ? "update" : "create"} event`
                );
            }

            alert(
                isEditMode
                    ? "Event updated successfully"
                    : "Meetup created successfully"
            );

            onClose();

            if (onUpdated) {
                onUpdated();
            }

        } catch (error) {
            console.error(
                isEditMode
                    ? "Update event error:"
                    : "Create meetup error:",
                error
            );

            alert(error.message);
        }
    };

    return (
        <div className="meetup-form-container">

            <div className="meetup-form">

                <button
                    className="close-btn"
                    onClick={onClose}
                    type="button"
                >
                    &times;
                </button>

                <h2>
                    {isEditMode
                        ? "Edit Meetup"
                        : "Create Meetup"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="title">
                            Title
                        </label>

                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            Description
                        </label>

                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="eventDate">
                            Date
                        </label>

                        <input
                            type="date"
                            id="eventDate"
                            value={eventDate}
                            onChange={(e) =>
                                setEventDate(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">
                            Location
                        </label>

                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) =>
                                setLocation(e.target.value)
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="totalSeats">
                            Total Seats
                        </label>

                        <input
                            type="number"
                            id="totalSeats"
                            min="1"
                            value={totalSeats}
                            onChange={(e) =>
                                setTotalSeats(e.target.value)
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="createBtn"
                    >
                        {isEditMode
                            ? "Update"
                            : "Create"}
                    </button>

                </form>

            </div>

        </div>
    );
}