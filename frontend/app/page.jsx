"use client";

import { useRouter } from "next/navigation";
import "./globals.css";

export default function Home() {

  const router = useRouter();

  const handleExplore = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    router.push("/events");
  };

  return (
    <main className="home-page">

      {/* Hero Section */}
      <section className="hero-section">

        <div className="hero-content">

          <p className="hero-label">
            CONNECT • MEET • PARTICIPATE
          </p>

          <h1>
            Discover Local Meetups
          </h1>

          <p className="hero-description">
            Find interesting events around you,
            connect with people, and join meetups
            that match your interests.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={handleExplore}
            >
              Explore Events
            </button>

            <button
              className="secondary-btn"
              onClick={() => router.push("/login")}
            >
              Get Started
            </button>

          </div>

        </div>

      </section>


      {/* Features Section */}
      <section className="features-section">
         <div className="hero-content">
        <h2>
          Everything you need for your next meetup
        </h2>

        <p className="features-subtitle">
          Easily discover, create, and manage local events.
        </p>

        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon">
              📅
            </div>

            <h3>Discover Events</h3>

            <p>
              Browse upcoming meetups and find
              events that interest you.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🙋
            </div>

            <h3>
              RSVP Easily
            </h3>

            <p>
              Let organizers know whether you're
              going, maybe attending, or not going.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">  👥  </div>
            <h3>Meet People</h3>
            <p>
              See who is attending and connect
              with other meetup participants.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🎯
            </div>

            <h3>
              Create Meetups
            </h3>

            <p>
              Organize your own event and manage
              attendees and available seats.
            </p>

          </div>

        </div>
      </div>
      </section>


      {/* CTA Section */}
      <section className="home-cta">

        <h2>
          Ready to find your next meetup?
        </h2>

        <p>
          Join an event or create your own meetup today.
        </p>

        <button
          onClick={handleExplore}
          className="primary-btn"
        >
          Browse Meetups
        </button>

      </section>

    </main>
  );
}