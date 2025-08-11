import React from 'react';
import whoWeAreBg from "./../assets/images/who-we-are-bg.png";
import FrontendLayout from '@/frontend/Layout/FrontendLayout';
import { Head } from '@inertiajs/react';

const WhoWeAre  = ({ auth }) => {
    return (
        <FrontendLayout
            user={auth.user}
            header={
                <h1 className="font-semibold text-xl text-gray-800 leading-tight">
                    Who We Are
                </h1>
            }
        >
            <Head title="Who We Are" />

            <div
                className="mt-10 p-4 shadow-2xl text-lg bg-cover"
                style={{ backgroundImage: "url(" + whoWeAreBg + ")" }}
            >
                <h1 className="text-sky-400 bg-black text-3xl p-4 text-center rounded-md">
                    Who We Are
                </h1>

                <div className="m-10 text-justify">
                    <p className="">
                        Welcome to JT, your one-stop-shop for all your IT
                        needs. We are a tech company that specializes in
                        providing a range of IT services including networking,
                        web design, software development, IT project management,
                        network design and implementation, and IT support.
                    </p>
                    <br />
                    <p className="">
                        At JT, we are committed to providing our clients
                        with the highest quality IT solutions that are tailored
                        to their specific needs. Our team of experienced
                        professionals is dedicated to helping our clients
                        achieve their business objectives by leveraging the
                        latest technologies and industry best practices.
                    </p>
                    <br />
                    <p className="">
                        We pride ourselves on our customer-centric approach, and
                        we believe in building long-term relationships with our
                        clients based on trust and transparency. We understand
                        that every client has unique requirements, and we work
                        closely with them to ensure that we deliver solutions
                        that meet their specific needs.
                    </p>
                    <br />
                    <p className="">
                        Whether you are a small business looking for IT support
                        or a large enterprise seeking to improve your IT
                        infrastructure, JT is here to help. Contact us
                        today to learn more about our services and how we can
                        help your business grow.
                    </p>
                </div>
            </div>
        </FrontendLayout>
    );
};

export default WhoWeAre ;