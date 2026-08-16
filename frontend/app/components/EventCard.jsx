"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Eventcard({event, onEdit, onRSVP}){
const [selectedStatus, setSelectedStatus] = useState(null);
const [loading, setLoading] = useState(false);
const router = useRouter();
const user = JSON.parse(
        localStorage.getItem("user")
    );
    const isOrganizer =
        user && user.id === event.created_by;
useEffect(() => {
    const fetchMyRsvp = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/rsvps/my",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            // Find this particular event
            const existingRsvp = data.rsvps.find(
                (rsvp) => rsvp.event_id === event.id
            );

            if (existingRsvp) {
                setSelectedStatus(existingRsvp.status);
            }

        } catch (error) {
            console.error(
                "Error fetching RSVP:",
                error
            );
        }
    };

    fetchMyRsvp();

}, [event.id]);
const handleRSVP = async (status) => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        return;
    }

    try {
        setLoading(true);

        const isUpdating = selectedStatus !== null;

        const response = await fetch(
            isUpdating
                ? `http://localhost:5000/api/rsvps/${event.id}`
                : "http://localhost:5000/api/rsvps",
            {
                method: isUpdating ? "PUT" : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(
                    isUpdating
                        ? { status }
                        : {
                            event_id: event.id,
                            status
                        }
                )
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to update RSVP"
            );
        }

        const oldStatus = selectedStatus;

        setSelectedStatus(status);

        // Tell parent to update available seats
        if (onRSVP) {
            onRSVP({
                eventId: event.id,
                status,
                oldStatus
            });
        }

        alert(
            isUpdating
                ? "RSVP updated successfully"
                : "RSVP successful"
        );

    } catch (error) {
        console.error("RSVP error:", error);
        alert(error.message);
    } finally {
        setLoading(false);
    }
};
const handleDelete = async () => {
    const token = localStorage.getItem("token");

    const confirmed = window.confirm(
        "Are you sure you want to delete this event?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:5000/api/events/${event.id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to delete event"
            );
        }

        alert("Event deleted successfully");

        // Refresh page
        window.location.reload();

    } catch (error) {
        console.error("Delete event error:", error);
        alert(error.message);
    }
};
      

return(
    <div className="event-card">
        <h2>{event.title}</h2>
        <p>{event.description}</p>
        <p><strong>Date:</strong>{new Date(event.event_date).toLocaleDateString()}</p>
        <p><strong>Location:</strong>{event.location}</p>
        <p><strong>Available seats: </strong>{event.available_seats}</p>
         {!isOrganizer && (
        <div className="rsvp-options">

    <button
        style={{
            backgroundColor:
                selectedStatus === "going"
                    ? "green"
                    : "#D3D3D3"
        }}
        onClick={() => handleRSVP("going")}
        disabled={
            loading ||
            event.available_seats <= 0
        }
    >
        Going
    </button>

    <button
        style={{
            backgroundColor:
                selectedStatus === "maybe"
                    ? "blue"
                    : "#D3D3D3"
        }}
        onClick={() => handleRSVP("maybe")}
        disabled={loading}
    >
        Maybe
    </button>

    <button
        style={{
            backgroundColor:
                selectedStatus === "declined"
                    ? "red"
                    : "#D3D3D3"
        }}
        onClick={() => handleRSVP("declined")}
        disabled={loading}
    >
        Not Going
    </button>

</div>)}
            {isOrganizer && (<><p><strong>Total seats: </strong>{event.total_seats}</p>
                <div className="btns" style={{
        display: "flex",
        gap: "15px"
    }}>
                    <button style={{backgroundColor:"blue", width:"100px", height:"40px"}} onClick={() => onEdit(event)}>Edit</button>
                    <button style={{backgroundColor:"red", width:"100px", height:"40px"}} onClick={handleDelete}>Delete</button>
                </div></>
            )}
            <button
        onClick={() => router.push(`/events/${event.id}/attendees`)} style={{background:"#65e065"}}
    >
        View Attendees
    </button>
    </div>
);
}

