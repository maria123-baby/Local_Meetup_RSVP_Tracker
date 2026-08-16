"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Eventcard from "../components/EventCard";
import CreateMeetup from "../components/CreateMeetup";

export default function Events() {

    const router = useRouter();

    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editEvent, setEditEvent] = useState(false);


    const fetchEvents = async () => {

        const token = localStorage.getItem("token");

        try {

            const response = await fetch(
                "http://localhost:5000/api/events",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch events"
                );
            }

            setEvents(data.events || []);

        } catch (error) {
            console.error("Fetch events error:", error);
        }
    };

    useEffect(() => {

        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!user || !token) {
            router.push("/login");
            return;
        }

        fetchEvents();

    }, [router]);
   const handleRSVPUpdate = ({
    eventId,
    status,
    oldStatus
}) => {

    setEvents((currentEvents) =>
        currentEvents.map((event) => {

            if (event.id !== eventId) {
                return event;
            }

            let seats = event.available_seats;

            // User changed TO going
            if (
                status === "going" &&
                oldStatus !== "going"
            ) {
                seats = seats - 1;
            }

            // User changed FROM going
            else if (
                oldStatus === "going" &&
                status !== "going"
            ) {
                seats = seats + 1;
            }

            return {
                ...event,
                available_seats: seats
            };
        })
    );
};

    // Called when Edit button is clicked
    const handleEdit = (event) => {
        setSelectedEvent(event);
        setEditEvent(true);
    };


    return (
        <main className="event-container">
 <button
    className="back-icon"
    onClick={() => router.back()}
    aria-label="Go back"
>
    <img src="/back-arrow.png" alt="Back" />
</button>
            <h1>Upcoming Events</h1>

            {events.length === 0 ? (

                <p style={{textAlign:"center", fontSize:"30px",color:"gray",fontWeight:"bold",margin:"60px"}}>No upcoming events available.</p>

            ) : (

                <div className="events-grid">

                    {events.map((event) => (
    
    <Eventcard
        key={event.id}
        event={event}
        onEdit={handleEdit}
        onRSVP={handleRSVPUpdate}
    />
))}
                </div>

            )}
 <CreateMeetup
                isOpen={editEvent}
                event={selectedEvent}
                onClose={() => {
                    setEditEvent(false);
                    setSelectedEvent(null);
                }}
                onUpdated={fetchEvents}
            />
        </main>
    );
}