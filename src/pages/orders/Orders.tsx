import React, { useEffect, useState } from "react";
import { API_ENDPOINT } from "../../config/constants";

interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price: number;
}

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_details?: Product; // To store additional product details
}

interface Order {
  id: number;
  updatedAt: string;
  total_price: number;
  status: string;
  OrderItems?: OrderItem[];
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch all orders
  const getAllOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINT}/api/orders`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const ordersData: Order[] = await response.json();

      // Fetch product details for each order item
      const ordersWithProductDetails = await Promise.all(
        ordersData.map(async (order) => {
          const itemsWithDetails = await Promise.all(
            order.OrderItems?.map(async (item) => {
              const productDetails = await fetchProductDetails(item.product_id);
              return { ...item, product_details: productDetails };
            }) || []
          );
          return { ...order, OrderItems: itemsWithDetails };
        })
      );

      setOrders(ordersWithProductDetails);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch product details by product_id
  const fetchProductDetails = async (productId: number): Promise<Product> => {
    const response = await fetch(`${API_ENDPOINT}/api/products/${productId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product details for product ID: ${productId}`);
    }
    return await response.json();
  };

  // Fetch orders on component mount
  useEffect(() => {
    getAllOrders();
  }, []);

  if (loading) {
    return <div className="p-4">Loading orders...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Order ID</th>
              <th className="border border-gray-300 px-4 py-2">Order Date</th>
              <th className="border border-gray-300 px-4 py-2">Total Amount</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Order Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border border-gray-300 px-4 py-2">{order.id}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(order.updatedAt).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  ₹{order.total_price}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {order.status}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex flex-col space-y-2">
                    {order.OrderItems?.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-start border border-gray-200 rounded p-2"
                      >
                        <div className="flex space-x-4">
                          <img
                            src={`data:image/png;base64, ${item.product_details?.image_url}`}
                            alt={item.product_details?.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-semibold">
                              {item.product_details?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.product_details?.description}
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-right">
                        ₹{item.product_details?.price ? item.product_details.price * item.quantity : "N/A"}                        </p>
                      </div>
                    )) || (
                      <p className="text-sm text-gray-500">No items found.</p>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
