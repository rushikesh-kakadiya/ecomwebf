import { useState, useEffect } from "react";
import { API_ENDPOINT } from "../config/constants";

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const token = localStorage.getItem("token");

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/cart`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }

      const data: CartItem[] = await response.json();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Add product to cart
  const addToCart = async (productId: string, quantity = 1) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/cart`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product to cart");
      }

      const data = await response.json();
      alert(data.message); // Show success message
      fetchCart(); // Refresh cart items
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return { cart, fetchCart, addToCart };
};
