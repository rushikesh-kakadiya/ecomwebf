import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react"; // Import Headless UI Dialog for modals
import { API_ENDPOINT } from "../../config/constants";

interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  createdAt: string;
  updatedAt: string;
  Product: {
    id: number;
    name: string;
    description: string;
    price: string;
    size: string[] | null;
    color: string;
    category: string;
    stock: number;
    image_url: string;
  };
}

const MyWishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<WishlistItem | null>(null); // To store the selected product for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // For modal visibility
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/api/wishlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setWishlist(data); // Set the wishlist items
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    if (token) {
      fetchWishlist(); // Fetch the wishlist on mount
    }
  }, [token]);

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove the item from the state after successful deletion
        setWishlist(wishlist.filter((item) => item.product_id !== productId));
      } else {
        console.error("Failed to remove item from wishlist.");
      }
    } catch (error) {
      console.error("Error removing item from wishlist:", error);
    }
  };

  const handleOpenModal = (product: WishlistItem) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold">My Wishlist</h2>
        {wishlist.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <li key={item.id} className="wishlist-item flex flex-col bg-gray-50 rounded-lg p-4 shadow">
                <div className="product-image mb-4">
                  <img
                    src={`data:image/jpeg;base64,${item.Product.image_url}`}
                    alt={item.Product.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="product-details flex-1">
                  <h3 className="font-semibold">{item.Product.name}</h3>
                  <p className="text-sm text-gray-600">Category: {item.Product.category}</p>
                  <p className="text-sm text-gray-600">Price: ₹{item.Product.price}</p>
                  <p className="text-sm text-gray-600">Stock: {item.Product.stock}</p>
                </div>
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleOpenModal(item)}
                    className="text-blue-500 hover:underline"
                  >
                    View Product
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.product_id)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your wishlist is empty.</p>
        )}
      </div>

      {/* Modal for viewing product details */}
      {selectedProduct && (
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <Dialog.Panel className="bg-white p-8 rounded-lg max-w-lg w-full">
              <Dialog.Title className="text-2xl font-semibold">{selectedProduct.Product.name}</Dialog.Title>
              <img
                src={`data:image/jpeg;base64,${selectedProduct.Product.image_url}`}
                alt={selectedProduct.Product.name}
                className="w-full h-64 object-cover rounded-lg my-4"
              />
              <p><strong>Category:</strong> {selectedProduct.Product.category}</p>
              <p><strong>Description:</strong> {selectedProduct.Product.description}</p>
              <p><strong>Price:</strong> ₹{selectedProduct.Product.price}</p>
              <p><strong>Color:</strong> {selectedProduct.Product.color}</p>
              <p><strong>Stock:</strong> {selectedProduct.Product.stock}</p>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="text-blue-500 hover:underline"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default MyWishlist;
