import { useState, useEffect } from "react";
import { API_ENDPOINT } from "../../config/constants";

interface Category {
  id?: number;
  name: string;
  description: string;
}

interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  size: string[];
  color: string;
  category: string;
  stock: number;
  image_url: File | null;
}

const Dashboard = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const token = localStorage.getItem("token");

  const [newCategory, setNewCategory] = useState<Category>({
    name: "",
    description: "",
  });
  const [newProduct, setNewProduct] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    size: [],
    color: "",
    category: "",
    stock: 0,
    image_url: null,
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/api/categories`);
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/api/products`);
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
    fetchProducts();
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewProduct({ ...newProduct, image_url: event.target.files[0] });
    }
  };

  const createProduct = async () => {
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price.toString());
    formData.append("color", newProduct.color);
    formData.append("category", newProduct.category);
    formData.append("stock", newProduct.stock.toString());
    if (newProduct.image_url) {
      formData.append("image_url", newProduct.image_url);
    }

    try {
      const response = await fetch(`${API_ENDPOINT}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      setProducts([...products, data]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct({ ...product });
  };

  const handleUpdateProduct = async () => {
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price.toString());
    formData.append("color", newProduct.color);
    formData.append("category", newProduct.category);
    formData.append("stock", newProduct.stock.toString());
    if (newProduct.image_url) {
      formData.append("image_url", newProduct.image_url);
    }

    try {
      const response = await fetch(
        `${API_ENDPOINT}/api/products/${newProduct.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      const updatedProduct = await response.json();
      setProducts(
        products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );
      setEditingProduct(null);
    } catch (error) {
      console.error(error);
    }
  };

  const createCategory = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory),
      });
      const data = await response.json();
      setCategories([...categories, data]);
      setNewCategory({ name: "", description: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      const response = await fetch(
        `${API_ENDPOINT}/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setProducts(products.filter((product) => product.id !== productId));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mt-6 mb-4">
        Admin Panel
      </h1>
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold">
          {editingProduct ? "Edit Product" : "Add Product"}
        </h2>
        <label>Product Name</label>
        <input
          type="text"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
          className="border rounded p-2 w-full mt-2"
        />

        <label>Description</label>
        <textarea
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          className="border rounded p-2 w-full mt-2"
        />

        <label>Price</label>
        <input
          type="number"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })
          }
          className="border rounded p-2 w-full mt-2"
        />

        <label>Size (comma-separated)</label>
        <input
          type="text"
          value={newProduct.size.join(", ")}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              size: e.target.value.split(",").map((s) => s.trim()),
            })
          }
          className="border rounded p-2 w-full mt-2"
        />

        <label>Color</label>
        <input
          type="text"
          value={newProduct.color}
          onChange={(e) =>
            setNewProduct({ ...newProduct, color: e.target.value })
          }
          className="border rounded p-2 w-full mt-2"
        />

        <label>Category</label>
        <select
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
          className="border rounded p-2 w-full mt-2"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>Stock</label>
        <input
          type="number"
          value={newProduct.stock}
          onChange={(e) =>
            setNewProduct({ ...newProduct, stock: parseInt(e.target.value) })
          }
          className="border rounded p-2 w-full mt-2"
        />

        <label>Upload Image</label>
        <input
          type="file"
          onChange={handleImageUpload}
          className="border rounded p-2 w-full mt-2"
        />

        <button
          onClick={editingProduct ? handleUpdateProduct : createProduct}
          className="bg-green-500 text-white p-2 rounded mt-2"
        >
          {editingProduct ? "Update Product" : "Add Product"}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>{category.name}</li>
          ))}
        </ul>
        <label>Category Name</label>
        <input
          type="text"
          value={newCategory.name}
          onChange={(e) =>
            setNewCategory({ ...newCategory, name: e.target.value })
          }
          className="border rounded p-2 w-full mt-2"
        />

        <label>Category Description</label>
        <textarea
          value={newCategory.description}
          onChange={(e) =>
            setNewCategory({ ...newCategory, description: e.target.value })
          }
          className="border rounded p-2 w-full mt-2"
        />

        <button
          onClick={createCategory}
          className="bg-blue-500 text-white p-2 rounded mt-2"
        >
          Add Category
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold">Products</h2>
        <table className="min-w-full mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.price}</td>
                <td className="px-4 py-2">{product.category}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="bg-blue-500 text-white p-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id!)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
