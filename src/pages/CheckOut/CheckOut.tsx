import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINT } from '../../config/constants';

const CheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const navigate = useNavigate();

  // Fetch cart items
  const fetchCartItems = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/cart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }

      const data = await response.json();
      setCartItems(data);

      // Calculate total price
      const total = data.reduce(
        (acc: number, item: any) => acc + item.Product.price * item.quantity,
        0
      );
      setTotalPrice(total);
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          cart_items: cartItems,
          total_price: totalPrice,
          shipping_address: shippingAddress,
        }),
      });

      if (response.ok) {
        alert('Order placed successfully!');

        // Remove checked-out items from the cart by calling the DELETE endpoint
        for (const item of cartItems) {
          await fetch(`${API_ENDPOINT}/api/cart/${item.id}`, {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
        }

        setCartItems([]); // Clear cart items after deletion
        navigate('/orders'); // Navigate to the orders page
      } else {
        const error = await response.json();
        alert(`Checkout failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An error occurred during checkout. Please try again.');
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
              <span>{item.Product.name} (x{item.quantity})</span>
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
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-2">Shipping Address</h2>
        <form className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="address"
            placeholder="Address"
            className="p-2 border rounded"
            value={shippingAddress.address}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            className="p-2 border rounded"
            value={shippingAddress.city}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            className="p-2 border rounded"
            value={shippingAddress.state}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            className="p-2 border rounded"
            value={shippingAddress.postalCode}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            className="p-2 border rounded"
            value={shippingAddress.country}
            onChange={handleInputChange}
            required
          />
        </form>
      </div>

      {/* Checkout Button */}
      <button
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        onClick={handleCheckout}
      >
        Place Order
      </button>
    </div>
  );
};

export default CheckoutPage;
