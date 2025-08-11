import React, { createContext, useState, useContext, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("Cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        // Save the cart data to localStorage whenever it changes
        localStorage.setItem("Cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity) => {
        const existingItemIndex = cartItems.findIndex(
            (item) => item.product.id === product.id
        );

        if (existingItemIndex >= 0) {
            // If product exists, update the item in the cart
            const updatedCartItems = [...cartItems];
            const existingItem = updatedCartItems[existingItemIndex];

            // Update quantity
            existingItem.quantity += quantity;

            // Merge selected sizes but avoid duplicates (only add new sizes)
            existingItem.product_size = [
                ...new Set([...existingItem.product_size, ...product.product_size]),
            ];

            updatedCartItems[existingItemIndex] = existingItem;
            setCartItems(updatedCartItems);
        } else {
            // Add product as a new item in the cart
            setCartItems([
                ...cartItems,
                {
                    product: product,
                    quantity: quantity,
                    product_size: product.product_size,
                },
            ]);
        }
    };

    const incrementQuantity = (productId) => {
        setCartItems((prevCartItems) =>
            prevCartItems.map((item) =>
                item.product.id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const decrementQuantity = (productId) => {
        setCartItems((prevCartItems) =>
            prevCartItems.map((item) =>
                item.product.id === productId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const removeItem = (productId) => {
        setCartItems((prevCartItems) =>
            prevCartItems.filter((item) => item.product.id !== productId)
        );
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                incrementQuantity,
                decrementQuantity,
                removeItem,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
