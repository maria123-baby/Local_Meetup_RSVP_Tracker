"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "../../../globals.css";

export default function AttendeesPage() {

    const params = useParams();
    const router = useRouter();

    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            router.push("/login");
            return;
        }

        const fetchAttendees = async () => {

            try {

                const response = await fetch(
                    `http://localhost:5000/api/events/${params.id}/attendees`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to fetch attendees"
                    );
                }

                setAttendees(data.attendees || []);

            } catch (error) {

                console.error(
                    "Fetch attendees error:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        fetchAttendees();

    }, [params.id, router]);


    if (loading) {
        return (
            <main className="attendees-page">
                <div className="attendees-container">
                    <p className="loading-text">
                        Loading attendees...
                    </p>
                </div>
            </main>
        );
    }


    return (
        <main className="attendees-page">
 <button
    className="back-icon"
    onClick={() => router.back()}
    aria-label="Go back"
>
    <img src="/back-arrow.png" alt="Back" />
</button>
            <div className="attendees-container">

               

                <div className="attendees-header">

                    <div>
                        <h1>Event Attendees</h1>

                        <p>
                            People who are attending this meetup
                        </p>
                    </div>

                    <div className="attendee-count">
                        <span>{attendees.length}</span>
                        <small>Attendees</small>
                    </div>

                </div>


                {attendees.length === 0 ? (

                    <div className="no-attendees">

                        <div className="empty-icon">
                            👥
                        </div>

                        <h2>No attendees yet</h2>

                        <p>
                            Be the first person to RSVP for
                            this event!
                        </p>

                    </div>

                ) : (

                    <div className="attendees-grid">

                        {attendees.map((attendee) => (

                            <div
                                className="attendee-card"
                                key={attendee.id}
                            >

                                <div className="avatar">
                                    {attendee.username
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="attendee-info">

                                    <h3>
                                        {attendee.username}
                                    </h3>

                                    <p>
                                        {attendee.email}
                                    </p>

                                </div>

                                <span className="going-badge">
                                    Going
                                </span>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </main>
    );
}