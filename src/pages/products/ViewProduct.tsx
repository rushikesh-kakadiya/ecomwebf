import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_ENDPOINT } from "../../config/constants";
import { Transition } from "@headlessui/react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useWishlist } from "../../hooks/useWishlist";  // Import the hook
import { useCart } from "../../hooks/useCart";

// Define interfaces
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
}

const ViewProduct = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { wishlist, handleWishlist } = useWishlist();
  const { addToCart } = useCart(); // Use the cart hook

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const isInWishlist = wishlist.some(
    (item) => item.product_id === Number(product?.id)
  );

  // Fetch Product Details
  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/products/${id}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch product");

      const data: Product = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        {/* Product Image */}
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 lg:aspect-none">
          <img
            src={`data:image/png;base64, ${product.image_url}`}
            alt={product.name}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
        </div>

        {/* Product Details */}
        <div className="mt-6 lg:mt-0 lg:col-span-1">
          <h1 className="text-3xl font-extrabold text-gray-900">{product.name}</h1>
          <p className="mt-3 text-lg text-gray-500">{product.category}</p>
          <p className="mt-4 text-xl font-medium text-gray-900">${product.price}</p>

          {/* Product Description */}
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">Description</h2>
            <p className="mt-2 text-base text-gray-700">{product.description}</p>
          </div>

          {/* Buttons: Add to Cart & Wishlist */}
          <div className="mt-6 flex items-center space-x-4">
            <button
              className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700"
              onClick={() => addToCart(product.id)} // Call addToCart from hook
            >
              Add to Cart
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => handleWishlist(Number(product.id), product.name)}
              className="text-red-500 hover:text-red-700 transition duration-300"
            >
              <Transition
                show={true}
                enter="transition-opacity duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                {isInWishlist ? (
                  <HeartSolidIcon className="h-7 w-7" />
                ) : (
                  <HeartIcon className="h-7 w-7" />
                )}
              </Transition>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;