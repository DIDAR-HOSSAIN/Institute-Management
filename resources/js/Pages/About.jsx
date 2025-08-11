import React from "react";

const About = () => {
    return (
            <section className="bg-gray-50 py-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-14">
                        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
                            About Bashiria Madrasha
                        </h1>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                            “Seeking knowledge is an obligation upon every Muslim.” — Prophet Muhammad ﷺ
                        </p>
                    </div>

                    {/* Content */}
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* History */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-2xl font-semibold text-green-700 mb-4">
                                Our Heritage
                            </h2>
                            <p className="text-gray-700 text-justify leading-relaxed">
                                Founded upon the sacred principles of Islam, Bashiria Madrasha has stood as a beacon of knowledge, character, and spiritual refinement for generations. With the noble intention of nurturing true servants of Allah ﷻ, the institution has flourished with the help of devoted teachers and pious scholars.
                            </p>
                            <p className="text-gray-700 text-justify mt-4 leading-relaxed">
                                Over the years, our madrasha has produced huffaz, ulama, and professionals who carry the light of Qur'an and Sunnah wherever they go — fulfilling their roles as leaders and ambassadors of Islamic values.
                            </p>
                        </div>

                        {/* Mission */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-2xl font-semibold text-green-700 mb-4">
                                Our Mission
                            </h2>
                            <p className="text-gray-700 text-justify leading-relaxed">
                                Bashiria Madrasha strives to blend traditional Islamic sciences with contemporary understanding, molding students into confident, God-conscious individuals. Our mission is not only to teach knowledge but to inspire action, ikhlas (sincerity), and service to the ummah.
                            </p>
                            <p className="text-gray-700 text-justify mt-4 leading-relaxed">
                                Through our alumni network, we aim to foster unity, build community programs, support underprivileged students, and strengthen the bond of brotherhood across generations.
                            </p>
                        </div>
                    </div>

                    {/* Core Values */}
                    <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
                        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
                            <h3 className="text-xl font-semibold text-green-700 mb-2">Knowledge</h3>
                            <p className="text-gray-700 text-justify">
                                Rooted in the Qur'an and Hadith, we seek sacred knowledge (‘ilm) that brings us closer to Allah and benefits humanity.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
                            <h3 className="text-xl font-semibold text-green-700 mb-2">Faith</h3>
                            <p className="text-gray-700 text-justify">
                                Our teachings nurture Iman and instill unwavering tawakkul (trust) in Allah in all aspects of life.
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300">
                            <h3 className="text-xl font-semibold text-green-700 mb-2">Community</h3>
                            <p className="text-gray-700 text-justify">
                                We believe in the power of unity — giving back to society, uplifting the ummah, and staying connected as one brotherhood.
                            </p>
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-20 text-center">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                            Join the Legacy. Empower the Future.
                        </h3>
                        <p className="text-gray-600 max-w-xl mx-auto mb-6 text-justify sm:text-center">
                            Your journey doesn't end at graduation. Stay involved, inspire future generations, and be a part of Bashiria Madrasha’s ongoing mission to illuminate hearts with sacred knowledge.
                        </p>
                        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300">
                            Become a Member of the Alumni
                        </button>
                    </div>
                </div>
            </section>
    );
};

export default About;
