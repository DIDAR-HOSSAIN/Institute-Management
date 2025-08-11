import React from "react";

const ProductModal = ({ product, onClose }) => {
    console.log('from product modal', product);
    const {
        product_id,
        product_name,
        product_category,
        sku,
        slug,
        image1,
        image2,
        image3,
        description,
        specification,
        others,
        contact_no,
    } = product;

    const specificationsList = Array.isArray(specification)
        ? specification
        : typeof specification === "string"
        ? specification.split(",")
        : [];

    return (
        <div className="mt-8">
            <dialog
                id="service_modal"
                className="modal modal-bottom sm:modal-middle"
                open
            >
                <div className="modal-box p-6 relative">
                    <button
                        className="btn btn-sm btn-circle btn-outline absolute right-4 top-4"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                    <h3 className="font-bold text-2xl text-center mb-4">
                        {product_name}
                    </h3>

                    <div className="flex justify-center space-x-4 mb-6">
                        {[image1, image2, image3].map(
                            (img, idx) =>
                                img && (
                                    <img
                                        key={idx}
                                        src={`/${img}`}
                                        alt={`${product_name} Image ${idx + 1}`}
                                        className="w-28 h-28 rounded shadow-md object-cover"
                                    />
                                )
                        )}
                    </div>

                    <div className="space-y-4">
                        <p className="text-justify">
                            <strong className="font-semibold">
                                Description:
                            </strong>
                            {description}
                        </p>

                        {specificationsList.length > 0 && (
                            <div>
                                <h4 className="font-semibold">
                                    Specifications:
                                </h4>
                                <ul className="list-disc pl-5 space-y-2">
                                    {specificationsList.map((spec, index) => (
                                        <li key={index}>{spec}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {product_id && (
                                <p>
                                    <strong className="font-semibold">
                                        Product ID:
                                    </strong>
                                    {product_id}
                                </p>
                            )}
                            {sku && (
                                <p>
                                    <strong className="font-semibold">
                                        SKU:
                                    </strong>
                                    {sku}
                                </p>
                            )}
                            {product_category && (
                                <p>
                                    <strong className="font-semibold">
                                        Category:
                                    </strong>
                                    {product_category}
                                </p>
                            )}
                            {slug && (
                                <p>
                                    <strong className="font-semibold">
                                        Slug:
                                    </strong>
                                    {slug}
                                </p>
                            )}
                            {contact_no && (
                                <p>
                                    <strong className="font-semibold">
                                        Contact No:
                                    </strong>
                                    {contact_no}
                                </p>
                            )}
                            {others && (
                                <p>
                                    <strong className="font-semibold">
                                        Others:
                                    </strong>
                                    {others}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default ProductModal;
