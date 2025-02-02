import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../../config/constants";
import { loadStripe } from "@stripe/stripe-js";
/// <reference types="vite/client" />

const CheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [shippingAddress, setShippingAddress] = useState<any>(null);
  const navigate = useNavigate();

  // Fetch selected cart items
  const fetchSelectedCartItems = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/cart/selected`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data);

        // Calculate total price
        const total = data.reduce(
          (acc: number, item: any) => acc + item.Product.price * item.quantity,
          0
        );
        setTotalPrice(total);
      } else {
        console.error("Failed to fetch selected cart items");
      }
    } catch (error) {
      console.error("Error fetching selected cart items:", error);
    }
  };

  // Fetch user shipping address
  const fetchUserAddress = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/user/address`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setShippingAddress(data);
      } else {
        console.error("Failed to fetch user shipping address");
      }
    } catch (error) {
      console.error("Error fetching user shipping address:", error);
    }
  };

  useEffect(() => {
    fetchSelectedCartItems();
    fetchUserAddress();
  }, []);

  const handleCheckout = async () => {
    try {
      const stripe_key = import.meta.env.VITE_STRIPE_KEY;
      const stripe = await loadStripe(stripe_key);
  
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }
  
      const response = await fetch(`${API_ENDPOINT}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          cart_items: cartItems,
          total_price: totalPrice,
          shipping_address: shippingAddress,
        }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Checkout failed: ${error.message}`);
      }
  
      const session = await response.json();
      await deleteSelectedCartItems();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });
  
      if (result.error) {
        throw new Error(result.error.message);
      }
  
      // Delete only selected cart items after successful checkout
  
      alert("Order placed successfully!");
      navigate("/orders");
    } catch (error: unknown) {
      console.error("Checkout error:", error);
  
      if (error instanceof Error) {
        alert(`An error occurred during checkout. Please try again. ${error.message}`);
      } else {
        alert("An unknown error occurred during checkout. Please try again.");
      }
    }
  };
  
  // Function to delete only selected cart items
  const deleteSelectedCartItems = async () => {
    try {
      // Filter selected cart items
      const selectedItems = cartItems.filter((item) => item.isSelected);
      console.log(selectedItems)
      
      // Delete each selected item
      for (const item of selectedItems) {
        await deleteCartItem(item.id);
      }
  
      // Refresh cart items in the local state
      setCartItems((prevItems) => prevItems.filter((item) => !item.isSelected));
    } catch (error) {
      console.error("Error deleting selected cart items:", error);
    }
  };
  
  // Function to delete a single cart item
  const deleteCartItem = async (cartItemId: number) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/cart/${cartItemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) {
        console.error(`Failed to delete cart item with ID: ${cartItemId}`);
      }
    } catch (error) {
      console.error(`Error deleting cart item with ID: ${cartItemId}`, error);
    }
  };
  
  
  
  

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Checkout</h1>

      {/* Order Summary */}
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">Order Summary</h2>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.Product.name} (x{item.quantity})
              </span>
              <span>₹{(item.Product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr />
          <div className="flex justify-between font-medium text-lg">
            <span>Total:</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      {shippingAddress && (
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-2">Shipping Address</h2>
          <p>
            {shippingAddress.address}, {shippingAddress.city},{" "}
            {shippingAddress.state}, {shippingAddress.postalCode},{" "}
            {shippingAddress.country}
          </p>
        </div>
      )}

      {/* Checkout Button */}
      <button
        className="w-full bg-black text-white py-2 px-4 rounded hover:bg-red-600 transition"
        onClick={handleCheckout}
        disabled={cartItems.length === 0}
      >
        Place Order
      </button>
    </div>
  );
};

export default CheckoutPage;
