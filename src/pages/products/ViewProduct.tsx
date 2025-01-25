/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_ENDPOINT } from "../../config/constants";

// Define the interface for a Product
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image_url: string;
}

const ViewProduct = () => {
  const { id } = useParams<{ id: string }>(); // Add type annotation for useParams
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Cart state (for demonstration, using local state)

  // Function to fetch product details based on ID
  const fetchProduct = async (id: string): Promise<Product | null> => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/products/${id}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product");
      }

      const data: Product = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };

  // Function to fetch the cart items
  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/cart`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cart items");
      }

    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Function to add product to the cart
  const handleAddToCart = async () => {
    if (product) {
      try {
        const response = await fetch(`${API_ENDPOINT}/api/cart`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: product.id,
            quantity: 1, // Default quantity of 1
          }),
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
    }
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        const data = await fetchProduct(id);
        setProduct(data);
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    fetchCart(); // Fetch cart items on component mount
  }, []);

  // Calculate total cart item count

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (!product) {
    return <p>Product not found</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-2 lg:gap-12">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 lg:aspect-none">
          <img
            src={`data:image/png;base64, ${product.image_url}`}
            alt={product.name}
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
        </div>

        <div className="mt-6 lg:mt-0 lg:col-span-1">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {product.name}
          </h1>
          <p className="mt-3 text-lg text-gray-500">{product.category}</p>
          <p className="mt-4 text-xl font-medium text-gray-900">
            ${product.price}
          </p>

          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">Description</h2>
            <p className="mt-2 text-base text-gray-700">
              {product.description}
            </p>
          </div>

          <div className="mt-6">
            <button
              className="inline-block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Cart item count display */}
      {/*<div className="fixed bottom-0 right-0 m-4 p-4 bg-indigo-600 text-white rounded-full text-lg">
        Cart: {cartCount} item{cartCount !== 1 ? "s" : ""}
      </div>*/}
    </div>
  );
};

export default ViewProduct;
