import { useEffect, useState } from "react";
import { API_ENDPOINT } from "../../config/constants";
import { Link } from "react-router-dom";
import Slider from "react-slick"; // Import Slider for handling more than 16 products
import "slick-carousel/slick/slick.css"; // Slider styles
import "slick-carousel/slick/slick-theme.css";

// Define the interface for a Product
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
}

const Products = () => {
  const fetchProducts = async (): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/products`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data: Product[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };

    loadProducts();
  }, []);

  // Slider settings for more than 16 products
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Set autoplay speed to 3 seconds
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="mx-auto w-full px-4 py-8">
      {loading ? (
        <p>Loading products...</p>
      ) : products.length > 16 ? (
        <Slider {...sliderSettings}>
          {products.map((product) => (
            <div key={product.id} className="p-4">
              <div className="group relative bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                <div className="w-full h-64 overflow-hidden">
                  <img
                    src={`data:image/png;base64,${product.image_url}`}
                    alt={product.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="mt-4 p-4 flex flex-col justify-between">
                  <h3 className="text-sm text-gray-700">
                    <Link to={`/products/${product.id}`}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {product.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.category}
                  </p>
                  <p className="mt-2 text-sm font-medium text-gray-900">
                    ₹{product.price}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="w-full h-64 overflow-hidden">
                <img
                  src={`data:image/png;base64,${product.image_url}`}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="mt-4 p-4 flex flex-col justify-between">
                <h3 className="text-sm text-gray-700">
                  <Link to={`/products/${product.id}`}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {product.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                <p className="mt-2 text-sm font-medium text-gray-900">
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
