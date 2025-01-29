import { useState, useEffect } from "react";
import { API_ENDPOINT } from "../config/constants";

interface WishlistItem {
  id: number;
  product_id: number;
  product_name: string;
}

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Fetch Wishlist from API
  const fetchWishlist = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/wishlist`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch wishlist");

      const data: WishlistItem[] = await response.json();
      setWishlist(data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  // Handle Wishlist Actions
  const handleWishlist = async (productId: number, productName: string) => {
    try {
      if (wishlist.some((item) => item.product_id === productId)) {
        // Remove from wishlist
        setWishlist((prev) => prev.filter((item) => item.product_id !== productId)); // UI Update

        const response = await fetch(`${API_ENDPOINT}/api/wishlist/${productId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to remove product from wishlist");

        fetchWishlist(); // Ensure backend update
      } else {
        // Add to wishlist
        setWishlist((prev) => [...prev, { id: Date.now(), product_id: productId, product_name: productName }]); // UI Update

        const response = await fetch(`${API_ENDPOINT}/api/wishlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ product_id: productId }),
        });

        if (!response.ok) throw new Error("Failed to add product to wishlist");

        fetchWishlist(); // Ensure backend update
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert("Something went wrong. Please try again!");
    }
  };

  return { wishlist, handleWishlist, fetchWishlist };
};
