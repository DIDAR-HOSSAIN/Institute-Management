import React from "react";
import events1 from "@/assets/images/Events/events1.jpeg";
import events2 from "@/assets/images/Events/events2.png";
import events3 from "@/assets/images/Events/events3.jpg";

const events = [
    {
        title: "Annual Alumni Meet 2025",
        date: "May 10, 2025",
        location: "Bashiria Madrasha Grounds",
        description:
            "Reconnect with your fellow alumni in a day filled with memories, speeches, and cultural programs.",
        image: events1,
    },
    {
        title: "Career Counseling Workshop",
        date: "June 15, 2025",
        location: "Conference Hall, Dhaka",
        description:
            "Guidance and insights for students and recent graduates from top industry experts.",
        image: events2,
    },
    {
        title: "Islamic Seminar & Iftar Mahfil",
        date: "March 22, 2025",
        location: "City Auditorium",
        description:
            "An enlightening evening of Islamic talks, followed by a community Iftar.",
        image: events3,
    },
];


const Event = () => {
    return (
            <section className="bg-gray-100 py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-800">
                            Upcoming Events
                        </h2>
                        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
                            Join us in our upcoming programs that aim to bring the community together and inspire progress.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {events.map((event, index) => (
                            <div key={index} className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        📅 {event.date} | 📍 {event.location}
                                    </p>
                                    <p className="mt-3 text-gray-700 text-sm">{event.description}</p>
                                </div>
                                <div className="mt-4">
                                    <button className="bg-green-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-green-700 transition">
                                        Learn More
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
    );
};

export default Event;
