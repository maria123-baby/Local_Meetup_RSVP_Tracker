# Local Meetup RSVP Tracker

A full-stack web application for creating and managing local meetup events.
Users can view upcoming events, RSVP with different statuses, and view their RSVPs.
Event organizers can create, edit, delete events and view attendees.

## Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Logout functionality

### Events
- View upcoming events
- Create meetup events
- The user who created events can edit and delete that particular event
- View available seats
- View attendees

### RSVP
- Update RSVP status(Going, Maybe, Declined)
- Automatically update available seats
- View user's RSVPs

### Authorization
- Only logged-in users can create events and RSVP
- Only the event organizer can edit or delete their event
- Organizer can view total seats
- Other users cannot modify someone else's event

## Technologies Used

### Frontend
- Next.js
- JavaScript
- CSS

### Backend
- Node.js
- Express.js
- JWT
- bcryptjs

### Database
- MySQL

### Development & Containerization
- Docker
- Docker Compose

### To Execute
- docker compose up