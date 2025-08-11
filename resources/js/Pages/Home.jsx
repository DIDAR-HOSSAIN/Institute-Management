import React from "react";
import FrontendLayout from "@/frontend/Layout/FrontendLayout";
import { Head } from "@inertiajs/react";
import Carousel from "@/frontend/ui/Carousel";
import HotItem from "@/frontend/ui/HotItem";
import About from "./About";
import Event from "./Event";
import ExecutiveMember from "./ExecutiveMember";
import NoticeBoard from "./NoticeBoard";
import Gallery from "./Gallery";

const Home = ({ auth, menus, sliders }) => {

    return (
        <FrontendLayout
        user={auth.user}
        menus={menus}
        >
            <Head title="Home" />

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-2 items-center">
                    {/* Carousel spans 2 columns for medium and large screens */}
                    <div className="md:col-span-2 flex items-stretch">
                        <div className="h-[400px] w-full flex-grow">
                            <Carousel sliders={sliders} />
                        </div>
                    </div>

                    {/* Hot Item - Hidden on small screens */}
                    <div className="hidden md:flex md:col-span-1 items-stretch">
                        <div className="h-[400px] w-full flex-grow">
                            <HotItem />
                        </div>
                    </div>
                </div>

                <About />
                <ExecutiveMember />
                <Event />
                <NoticeBoard />
                <Gallery />
            </div>
        </FrontendLayout>
    );
};

export default Home;