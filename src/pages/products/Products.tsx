import { useEffect, useState } from "react";
import { API_ENDPOINT } from "../../config/constants";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useWishlist } from "../../hooks/useWishlist";
import { HeartIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useCart } from "../../hooks/useCart";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { wishlist, handleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/api/products`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Failed to fetch products");

        const data: Product[] = await response.json();
        setProducts(data);
        setFilteredProducts(data);

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((p) => p.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      setFilteredProducts(products.filter((p) => p.category === category));
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <div className="mx-auto w-full px-4 py-8 flex flex-col md:flex-row gap-6">
      {/* Left Sidebar - Categories */}
      <div className="w-full md:w-1/4 bg-white p-4 shadow rounded-md">
        <h2 className="text-lg font-semibold mb-4">Sort by Categories</h2>
        <ul className="space-y-2">
          <li
            onClick={() => handleCategoryFilter(null)}
            className={`cursor-pointer p-2 rounded ${
              selectedCategory === null
                ? "bg-indigo-600 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            All Categories
          </li>
          {categories.map((category) => (
            <li
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`cursor-pointer p-2 rounded ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>

      {/* Products Grid */}
      <div className="w-full md:w-3/4">
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                handleWishlist={handleWishlist}
                wishlist={wishlist}
                addToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({
  product,
  handleWishlist,
  wishlist,
  addToCart,
}: {
  product: Product;
  handleWishlist: any;
  wishlist: any;
  addToCart: (id: string) => void;
}) => {
  const isInWishlist = wishlist.some(
    (item: any) => item.product_id === Number(product.id)
  );

  return (
    <div className="group relative bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden p-4">
      <Link to={`/products/${product.id}`} className="block">
        <div className="w-full h-64 overflow-hidden">
          <img
            src={`data:image/png;base64,${product.image_url}`}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="mt-4 flex flex-col justify-between">
          <h3 className="text-sm text-gray-700">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{product.category}</p>
          <p className="mt-2 text-sm font-medium text-gray-900">
            ₹{product.price}
          </p>
        </div>
      </Link>

      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          handleWishlist(Number(product.id), product.name);
        }}
        className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition duration-300"
      >
        {isInWishlist ? (
          <HeartSolidIcon className="h-7 w-7" />
        ) : (
          <HeartIcon className="h-7 w-7" />
        )}
      </button>

      {/* Floating Add to Cart Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          addToCart(product.id);
        }}
        className="absolute bottom-3 right-3 bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700 transition duration-300"
      >
        <ShoppingCartIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default Products;
