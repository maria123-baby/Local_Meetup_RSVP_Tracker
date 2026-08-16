"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "../components/StatusBadge";
import "../globals.css";

export default function MyRsvps() {

    const router = useRouter();

    const [rsvps, setRsvps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!user || !token) {
            router.push("/login");
            return;
        }

        const fetchRsvps = async () => {

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
                    throw new Error(
                        data.message ||
                        "Failed to fetch RSVPs"
                    );
                }

                setRsvps(data.rsvps || []);

            } catch (error) {

                console.error(
                    "Fetch RSVPs error:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        fetchRsvps();

    }, [router]);


    if (loading) {
        return (
            <main className="my-rsvp-page">
                <div className="rsvp-container">
                    <p className="loading-text">
                        Loading your RSVPs...
                    </p>
                </div>
            </main>
        );
    }


    return (
        <main className="my-rsvp-page">
 <button
    className="back-icon"
    onClick={() => router.back()}
    aria-label="Go back"
>
    <img src="/back-arrow.png" alt="Back" />
</button>
            <div className="rsvp-container">

                <div className="rsvp-header">

                    <div>
                        <h1>My RSVPs</h1>

                        <p>
                            Events you have responded to
                        </p>
                    </div>

                    <div className="rsvp-count">
                        <span>{rsvps.length}</span>
                        <small>RSVPs</small>
                    </div>

                </div>


                {rsvps.length === 0 ? (

                    <div className="no-rsvps">

                        <div className="empty-icon">
                            <img src="/date.png" alt="date" />
                        </div>

                        <h2>No RSVPs yet</h2>

                        <p>
                            You haven't RSVP'd to any events yet.
                        </p>

                        <button
                            className="browse-events-btn"
                            onClick={() =>
                                router.push("/events")
                            }
                        >
                            Browse Events
                        </button>

                    </div>

                ) : (

                    <div className="rsvp-grid">

                        {rsvps.map((rsvp) => (

                            <div
                                className="rsvp-card"
                                key={rsvp.id}
                            >

                                <div className="rsvp-card-header">

                                    <h2>
                                        {rsvp.title}
                                    </h2>

                                </div>

                                <p className="rsvp-description">
                                    {rsvp.description}
                                </p>

                                <div className="rsvp-details">

                                    <p>
                                        <span><img src="/location.png" alt="Location" style={{width: "20px",
    height: "20px",
    objectFit: "contain"}} /></span>
                                        {rsvp.location}
                                    </p>

                                    <p>
                                        <span><img src="/date.png" alt="Date" style={{width: "20px",
    height: "20px",
    objectFit: "contain"}} /></span>
                                        {new Date(
                                            rsvp.event_date
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric"
                                            }
                                        )}
                                    </p>

                                </div>

                                <div className="rsvp-status">

                                    <span>
                                        Your response
                                    </span>

                                    <StatusBadge
                                        status={rsvp.status}
                                    />

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </main>
    );
}