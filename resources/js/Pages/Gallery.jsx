import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid"
import img1 from "@/assets/images/Gallery/gallery1.jpg";
import img2 from "@/assets/images/Gallery/gallery2.jpg";
import img3 from "@/assets/images/Gallery/gallery3.jpg";
import img4 from "@/assets/images/Gallery/gallery4.jpg";
import img5 from "@/assets/images/Gallery/gallery5.jpg";
import img6 from "@/assets/images/Gallery/gallery6.jpg";

// Image array
const images = [img1, img2, img3, img4, img5, img6];

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    return (
            <section className="py-12 bg-gray-100">
                <div className="max-w-6xl mx-auto px-6 text-center">

                    {/* Title and Caption */}
                    <h2 className="text-3xl font-bold text-gray-800 sm:text-4xl">
                        Ex-Students Council Gallery
                    </h2>
                    <p className="mt-4 text-gray-600">
                        Honoring the dedication and leadership of our former student council members — a legacy of service, unity, and inspiration that continues to guide our community.
                    </p>

                    {/* Gallery Grid */}
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {images.map((img, index) => (
                            <div
                                key={index}
                                className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md"
                                onClick={() => setSelectedImage(img)}
                            >
                                <img
                                    src={img}
                                    alt={`Gallery Image ${index + 1}`}
                                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white font-semibold text-lg">
                                    View Image
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Lightbox Modal */}
                    {selectedImage && (
                        <Dialog
                            open={!!selectedImage}
                            onClose={() => setSelectedImage(null)}
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"
                        >
                            <div className="relative bg-white p-4 rounded-lg max-w-3xl w-full shadow-lg">
                                <button
                                    className="absolute top-2 right-2 text-gray-800 hover:text-red-500"
                                    onClick={() => setSelectedImage(null)}
                                >
                                    <XMarkIcon className="h-6 w-6" />
                                </button>
                                <img
                                    src={selectedImage}
                                    alt="Selected"
                                    className="w-full h-auto rounded-lg"
                                />
                            </div>
                        </Dialog>
                    )}
                </div>
            </section>
    );
};

export default Gallery;
