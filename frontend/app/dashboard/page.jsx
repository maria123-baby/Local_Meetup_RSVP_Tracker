"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateMeetup from "../components/CreateMeetup";


export default function Dashboard() {
    const [createMeetup, setCreateMeetup] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem("user");
    if(!user){
        router.push("/login");
        
    }
  }, [router]);
  return(
    <div>
        <div className="dashboard-container">
            <h1>Dashboard</h1>
                <button
    type="button"
    className="createBtn"
    onClick={() => {
        setCreateMeetup(true);
    }}
>
    Create
</button>
{<CreateMeetup isOpen={createMeetup} onClose={()=>setCreateMeetup(false)}/>}
            <div className="dashboard-grid">

                <div className="dashboard-card">
                    <h2>Upcoming Events</h2>
                    <p>View and join upcoming meetups.</p>
                    <button onClick={() => router.push("/events")}>
                        View Events
                    </button>
                </div>
                <div className="dashboard-card">
                    <h2>My RSVPs</h2>
                    <p>View the events you have joined.</p>
                    <button onClick={() => router.push("/rsvps")}>
                        View RSVPs
                    </button>
                </div>
            </div>
        </div>
    </div>
  )
}