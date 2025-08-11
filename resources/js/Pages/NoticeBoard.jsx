import FrontendLayout from "@/frontend/Layout/FrontendLayout";
import React from "react";

const exNotices = [
    {
        title: "Ex-Students Reunion Registration",
        date: "April 25, 2025",
        description: "All ex-students are invited to register for the grand reunion program. Limited seats available!",
    },
    {
        title: "Call for Alumni Speakers",
        date: "March 15, 2025",
        description: "We are looking for alumni speakers to share inspiring stories at the upcoming reunion event.",
    },
    {
        title: "Scholarship Fundraiser Contribution",
        date: "February 20, 2025",
        description: "Join hands to support our scholarship program for underprivileged students. Every contribution matters.",
    },
];

const NoticeBoard = () => {
    return (
            <section className="bg-gradient-to-br from-green-50 to-white py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-green-700">🎓 Ex-Students Notice Board</h2>
                        <p className="mt-2 text-gray-600">
                            Stay connected. Stay informed. Explore the latest updates for our alumni community.
                        </p>
                    </div>

                    {/* Notices Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exNotices.map((notice, index) => (
                            <div
                                key={index}
                                className="bg-white border-l-4 border-green-600 shadow-sm rounded-lg p-5 hover:shadow-lg transition"
                            >
                                <div className="flex justify-between items-start">
                                    <h3 className="text-lg font-semibold text-gray-800">{notice.title}</h3>
                                    <span className="text-xs text-gray-500">{notice.date}</span>
                                </div>
                                <p className="mt-3 text-sm text-gray-700 leading-relaxed">{notice.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-12 text-center">
                        <p className="text-sm text-gray-600">
                            Want to post a notice? Contact us at{" "}
                            <span className="text-green-600 font-semibold">bashiriamadrasah@gmail.com</span>
                        </p>
                    </div>
                </div>
            </section>
    );
};

export default NoticeBoard;
