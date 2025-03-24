import { ReactNode, createContext, useContext, useState } from "react";
import { CartItem } from "../types/CartItem";

interface CartContextType{
    cart: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (bookId: number) => void;
    clearCart: () => void;
    removeOneFromCart: (bookId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({children}:{children: ReactNode}) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            // Find the existing item in the cart
            const existingItem = prevCart.find((c) => c.bookId === item.bookId);
            
            if (existingItem) {
                // Update the existing item by incrementing the quantity
                const updatedCart = prevCart.map((c) =>
                    c.bookId === item.bookId
                        ? { ...c, quantity: c.quantity + 1 }
                        : c
                );
                return updatedCart;
            } else {
                // Add the item with quantity 1 if it's not already in the cart
                return [...prevCart, { ...item, quantity: 1 }];
            }
        });
    };    
    
    

    const removeFromCart = (bookId : number) => {
        setCart((prevCart) => prevCart.filter((c)=> c.bookId !== bookId));
    };

    const clearCart = () => {
        setCart(() => []);
    };

    const removeOneFromCart = (bookId: number) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map((item) =>
                item.bookId === bookId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );
            // If quantity reaches 1, just remove the book
            return updatedCart.filter(item => item.quantity > 0);
        });
    };    
    

    return(
        <CartContext.Provider 
            value={{ cart, addToCart, removeFromCart, removeOneFromCart, clearCart }}>
            {children}
        </CartContext.Provider>

    );
};

export const useCart = ()=> {
    const context = useContext(CartContext);
    if (!context){
        throw new Error('useCart must be within a CartProvider')
    }
    return context;
}

