import React from "react";
import hotItem from "@/assets/images/latest-news/eid-re-union.jpg";

const HotItem = () => {
    return (
        <div className="relative w-full overflow-hidden h-[400px]">
            <div className="flex transition-transform duration-700 ease-in-out">
                <div className="w-full flex-shrink-0 hidden lg:block">
                    <img
                        src={hotItem}
                        alt="Exclusive Boutiques"
                        className="object-cover h-full w-full"
                    />
                </div>
            </div>
        </div>
    );
};

export default HotItem;
