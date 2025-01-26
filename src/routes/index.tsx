import { createBrowserRouter } from "react-router-dom";
import HomePage from "../layouts/HomePage";
import ViewProduct from "../pages/products/ViewProduct";
import Products from "../pages/products/Products";
import CheckoutPage from "../pages/CheckOut/CheckOut";
import Orders from "../pages/orders/Orders";
import CartPage from "../pages/cart/Cart";
import SuccessPage from "../layouts/success";
import FailurePage from "../layouts/failure";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />, // HomePage with Appbar for all routes
    children: [
      {
        path: "/", // Home route
        element: <Products/>, // Replace with actual home content
      },
      {
        path: "products", // Products page
        element: <Products />,
      },
      {
        path: "products/:id", // View individual product
        element: <ViewProduct />,
      },
      {
        path: "checkout", // Products page
        element: <CheckoutPage />,
      },
      {
        path: "orders", // Products page
        element: <Orders />,
      },
      {
        path: "cart", // Products page
        element: <CartPage />,
      },
      {
        path: "success", // Products page
        element: <SuccessPage />,
      },
      {
        path: "failure", // Products page
        element: <FailurePage />,
      },
    ],
  },
]);

export default router;
