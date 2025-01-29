import { createBrowserRouter } from "react-router-dom";
import HomePage from "../layouts/HomePage";
import ViewProduct from "../pages/products/ViewProduct";
import Products from "../pages/products/Products";
import CheckoutPage from "../pages/CheckOut/CheckOut";
import Orders from "../pages/orders/Orders";
import CartPage from "../pages/cart/Cart";
import SuccessPage from "../layouts/success";
import FailurePage from "../layouts/failure";
import SigninForm from "../pages/signin/Signin";
import SignupForm from "../pages/signup/Signup";
import Logout from "../pages/logout/Logout";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/admin/Admin";
import PrivateRoute from "./PrivateRoute";
import MyWishlist from "../pages/mywishlist/MyWishlist";

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SigninForm />,
  },
  {
    path: "/signup",
    element: <SignupForm />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/",
    element: <HomePage />, // HomePage with Appbar for all routes
    children: [
      {
        path: "/", // Home route
        element: <Products />, // Public route
      },
      {
        path: "/admin",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
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
        path: "checkout", // Checkout requires authentication
        element: <ProtectedRoute element={<CheckoutPage />} />,
      },
      {
        path: "orders", // Orders require authentication
        element: <ProtectedRoute element={<Orders />} />,
      },
      {
        path: "cart", // Cart page requires authentication
        element: <ProtectedRoute element={<CartPage />} />,
      },
      {
        path: "success", // Success page
        element: <ProtectedRoute element={<SuccessPage />} />,
      },
      {
        path: "mywishlist", // Success page
        element: <ProtectedRoute element={<MyWishlist />} />,
      },
      {
        path: "failure", // Failure page
        element: <FailurePage />, // No protection needed
      },
    ],
  },
]);

export default router;
