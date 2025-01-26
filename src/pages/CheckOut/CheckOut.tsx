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
  
      // Ensure stripe is properly loaded before proceeding
      if (!stripe) {
        throw new Error("Stripe failed to load");
      }
  
      // Make a request to create an order
      const response = await fetch(`${API_ENDPOINT}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure you are handling token correctly
        },
        body: JSON.stringify({
          cart_items: cartItems,
          total_price: totalPrice,
          shipping_address: shippingAddress,
        }),
      });
  
      // Check for response validity before processing
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Checkout failed: ${error.message}`);
      }
  
      const session = await response.json();
      console.log(session);
      
      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });
  
      if (result.error) {
        throw new Error(result.error.message);
      }
  
      // After successful checkout session redirection
      alert('Order placed successfully!');
      navigate('/orders');
      
    } catch (error: unknown) {
      console.error("Checkout error:", error);
  
      // Type assertion to handle error as an instance of Error
      if (error instanceof Error) {
        alert(`An error occurred during checkout. Please try again. ${error.message}`);
      } else {
        alert("An unknown error occurred during checkout. Please try again.");
      }
    }
  };
  
  

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

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
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        onClick={handleCheckout}
        disabled={cartItems.length === 0}
      >
        Place Order
      </button>
    </div>
  );
};

export default CheckoutPage;
