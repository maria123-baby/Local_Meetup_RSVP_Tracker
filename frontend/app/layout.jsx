import Navbar from "./components/Navbar";
export const metadata = {
   title: "Local Meetup RSVP Tracker",
   description: "This is a Next.js applicaton which track the attendees in a local meetup."
};
export default function RootLayout({children}) {
  return (
    <html lang="en">
      
      <body>
        <Navbar/>
        {children}</body>
    </html>
  );
}
