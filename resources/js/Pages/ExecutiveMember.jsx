import React from "react";
import FrontendLayout from "@/frontend/Layout/FrontendLayout";
import member1 from "@/assets/images/Members/member1.jpeg";
import member2 from "@/assets/images/Members/member2.jpg";
import member3 from "@/assets/images/Members/member3.jpg";
import member4 from "@/assets/images/Members/member4.jpg";
import member5 from "@/assets/images/Members/member5.jpg";
import member6 from "@/assets/images/Members/member6.jpg";

const members = [
    { name: "Maulana Abdullah Al Bashir", role: "President", image: member1 },
    { name: "Md. Rahmat Ullah", role: "Vice President", image: member2 },
    { name: "Mufti Shahin Ahmed", role: "General Secretary", image: member3 },
    { name: "Nurul Islam", role: "Treasurer", image: member4 },
    { name: "Kazi Hossain", role: "Cultural Secretary", image: member5 },
    { name: "Abdul Karim", role: "Executive Member", image: member6 },
];


const ExecutiveMember = () => {
    return (
            <section className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
                            Executive Members
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            Meet the dedicated individuals serving the Bashiria Madrasha Alumni Association with sincerity, vision, and commitment to the community.
                        </p>
                    </div>

                    {/* Grid of Members */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {members.map((member, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden text-center"
                            >
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="p-5">
                                    <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                                    <p className="text-green-700 font-medium mt-1">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Footer CTA */}
                    <div className="mt-20 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            United for Deen, Dedicated to the Ummah
                        </h2>
                        <p className="text-gray-600 mt-3 max-w-xl mx-auto text-justify sm:text-center">
                            Every executive member plays a vital role in shaping the future of our alumni and upholding the legacy of Bashiria Madrasha with sincerity, unity, and the love of Islam.
                        </p>
                    </div>
                </div>
            </section>
    );
};

export default ExecutiveMember;
