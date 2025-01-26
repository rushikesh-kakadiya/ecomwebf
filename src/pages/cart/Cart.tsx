import React, { useState, useEffect } from 'react';
import { API_ENDPOINT } from '../../config/constants';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/cart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data);
      } else {
        console.error('Failed to fetch cart items');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const updateCartItemSelection = async (cartItemId: number, isSelected: boolean) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/cart/select/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ cartItemId, isSelected }),
      });
      console.log(response);
      
      if (response.ok) {
        fetchCartItems(); // Refresh cart items
      } else {
        console.error('Failed to update cart item selection');
      }
    } catch (error) {
      console.error('Error updating cart item selection:', error);
    }
  };

  const updateCartItemQuantity = async (cartItemId: number, quantity: number) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        fetchCartItems(); // Refresh cart items
      } else {
        console.error('Failed to update cart item quantity');
      }
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  const deleteCartItem = async (cartItemId: number) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        fetchCartItems(); // Refresh cart items
      } else {
        console.error('Failed to delete cart item');
      }
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Shopping Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4"
              >
                <img
                  src={`data:image/png;base64,${item.Product.image_url}`}
                  alt={item.Product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1 ml-4">
                  <h2 className="font-medium text-gray-800">{item.Product.name}</h2>
                  <p className="text-sm text-gray-500">
                    ₹{item.Product.price} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={item.isSelected}
                    onChange={(e) => updateCartItemSelection(item.id, e.target.checked)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Select</span>
                </div>

                {/* Update quantity */}
                <div className="flex items-center ml-4">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded-full text-gray-700"
                    onClick={() => item.quantity > 1 && updateCartItemQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="mx-2 text-sm text-gray-700">{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded-full text-gray-700"
                    onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Delete item */}
                <button
                  className="text-red-600 hover:text-red-700"
                  onClick={() => deleteCartItem(item.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
            <p className="text-sm text-gray-600 mb-2">
              Selected Items:{" "}
              {
                cartItems.filter((item) => item.isSelected).reduce(
                  (total, item) => total + item.quantity,
                  0
                )
              }
            </p>
            <p className="text-lg font-semibold text-gray-800">
              Total Price: ₹
              {cartItems
                .filter((item) => item.isSelected)
                .reduce(
                  (total, item) => total + item.Product.price * item.quantity,
                  0
                )
                .toFixed(2)}
            </p>
            <button
              className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              disabled={cartItems.filter((item) => item.isSelected).length === 0}
              onClick={() => navigate("/CheckOut")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl font-medium text-gray-700">Your cart is empty</p>
          <p className="text-sm text-gray-500 mt-2">
            Add items to your cart and they will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default CartPage;
