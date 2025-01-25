// CartContext.tsx
import { createContext, useContext, useState } from "react";

// Interface for cart items
interface CartItem {
  id: string;
  quantity: number;
}

// Creating the Cart Context
const CartContext = createContext<{
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
}>({
  cart: [],
  addToCart: () => {},
});

// Cart Provider to wrap the app
export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: CartItem) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingProductIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += product.quantity;
        return updatedCart;
      } else {
        return [...prevCart, product];
      }
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => useContext(CartContext);
