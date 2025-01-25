import { Outlet } from "react-router-dom";
import Appbar from "./Appbar";
import { CartProvider } from "../context/CartContext";

const HomePage = () => {
  return (
    <>
      <CartProvider>
        <Appbar />
      </CartProvider>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default HomePage;
