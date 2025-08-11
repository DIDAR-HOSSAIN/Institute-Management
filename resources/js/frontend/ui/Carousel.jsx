import React, { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";

const Carousel = () => {
    const { sliders } = usePage().props;
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) =>
                prevSlide === sliders?.length - 1 ? 0 : prevSlide + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, [sliders?.length]);

    const goToSlide = (index) => setCurrentSlide(index);

    const nextSlide = () =>
        setCurrentSlide((prevSlide) =>
            prevSlide === sliders?.length - 1 ? 0 : prevSlide + 1
        );

    const prevSlide = () =>
        setCurrentSlide((prevSlide) =>
            prevSlide === 0 ? sliders?.length - 1 : prevSlide - 1
        );

    return (
        <div className="relative max-h-[400px] overflow-hidden">
            <div className="relative">
                {sliders?.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`${
                            index === currentSlide ? "block" : "hidden"
                        } w-full h-[400px]`}
                    >
                        <img
                            src={`/public/images/slider/${slide.image}`}
                            // src={`/images/slider/${slide.image}`}
                            alt={slide.slider_name}
                            className="w-full h-full object-cover"
                        />
                        <h3 className="absolute bottom-4 left-4 text-white text-lg bg-black bg-opacity-60 px-3 py-1 rounded">
                            {slide.slider_name}
                        </h3>
                    </div>
                ))}
                <button
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded hover:bg-opacity-70"
                    onClick={prevSlide}
                >
                    &#10094;
                </button>
                <button
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded hover:bg-opacity-70"
                    onClick={nextSlide}
                >
                    &#10095;
                </button>
            </div>
            <div className="flex justify-center mt-2 space-x-2">
                {sliders?.map((_, index) => (
                    <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                            index === currentSlide
                                ? "bg-black"
                                : "bg-gray-400"
                        }`}
                        onClick={() => goToSlide(index)}
                    ></button>
                ))}
            </div>
        </div>
    );
};

export default Carousel;
