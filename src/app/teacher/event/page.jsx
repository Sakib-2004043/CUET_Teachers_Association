import Link from "next/link";
import "./event.css";

export default function Events() {
  const events = [
    {
      title: "3rd General Meeting of CUET Teachers Association held at CUET",
      date: "January 17, 2025",
      description: "A meeting has been held by CUET Teachers Association Executive Board",
    },
    {
      title: "2025 International Conference on Electrical, Computer and Communication Engineering (ECCE)",
      date: "12-14 February 2025",
      description: "The conference will bring together researchers, scholars, and academic scientists.",
    },
    {
      title: "Faculty Meet & Greet",
      date: "2024-12-15",
      description: "Informal meeting to discuss teaching strategies and exchange ideas.",
    },
    {
      title: "Workshop on Artificial Intelligence in Education",
      date: "March 10, 2025",
      description: "A hands-on workshop to explore the applications of AI in modern education.",
    },
    {
      title: "Annual Sports and Cultural Fest",
      date: "April 20-22, 2025",
      description: "A three-day event filled with sports, cultural programs, and inter-departmental competitions.",
    },
    {
      title: "Seminar on Climate Change and Sustainable Development",
      date: "May 5, 2025",
      description: "A seminar to discuss the impact of climate change and strategies for sustainable development.",
    },
  ];
  

  return (
    <div className="page-container">
      <header className="header">
        <h1>Upcoming events</h1>
        <Link href="/" className="go-home">
          Go To Home
        </Link>
      </header>
      <div className="events-container">
        {events.map((event, index) => (
          <div key={index} className="event-card">
            <h2>{event.title}</h2>
            <p><strong>Date:</strong> {event.date}</p>
            <p>{event.description}</p>
            <div className="buttons">
              <button className="attend-button">Will Attend</button>
              <button className="not-attend-button">Will Not Attend</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
