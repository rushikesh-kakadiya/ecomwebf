import React, { useState, useEffect, useRef } from 'react';
import { API_ENDPOINT } from '../../config/constants';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: number;
  Product: {
    name: string;
    price: number;
    image_url: string;
  };
  quantity: number;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null); // Reference for the cart dropdown
  const navigate = useNavigate();

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/cart`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart items');
      }

      const data: CartItem[] = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const updateCartItemQuantity = async (cartItemId: number, quantity: number) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/cart/${cartItemId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart item quantity');
      }

      const updatedCartItem = await response.json();
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity: updatedCartItem.cartItem.quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  };

  const deleteCartItem = async (cartItemId: number) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/cart/${cartItemId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete cart item');
      }

      setCartItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchCartItems();
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.Product.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    const totalPrice = calculateTotal();
    localStorage.setItem('totalPrice', totalPrice.toString());
    navigate('/checkout');
  };

  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <button
        className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
        onClick={toggleCart}
      >
        🛒
      </button>

      {isOpen && (
        <div
          ref={cartRef}
          className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Cart</h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>

          {cartItems.length > 0 ? (
            <>
              <ul className="divide-y divide-gray-200 mt-2">
                {cartItems.map((item) => (
                  <li key={item.id} className="py-2 flex items-center">
                    <img
                      src={`data:image/png;base64,${item.Product.image_url}`}
                      alt={item.Product.name}
                      className="h-12 w-12 object-cover rounded-md"
                    />
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.Product.name}</p>
                      <p className="text-sm text-gray-500">
                        ₹{item.Product.price} x {item.quantity}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          className="px-2 py-1 bg-gray-200 text-gray-700 rounded"
                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          className="px-2 py-1 bg-gray-200 text-gray-700 rounded"
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      className="ml-3 text-red-500 hover:text-red-700"
                      onClick={() => deleteCartItem(item.id)}
                    >
                      🗑
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <p className="text-lg font-semibold text-gray-900">
                  Total: ₹{calculateTotal().toFixed(2)}
                </p>
                <button
                  className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 mt-4">Your cart is empty</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
