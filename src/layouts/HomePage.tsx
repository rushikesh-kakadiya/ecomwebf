import { Outlet } from "react-router-dom";
import Appbar from "./Appbar";
import { CartProvider } from "../context/CartContext";
import Footer from "./Footer";

const HomePage = () => {
  return (
    <>
      <CartProvider>
        <Appbar />
      </CartProvider>
      <main>
        <Outlet />
      </main>
      <Footer/>
    </>
  );
};

export default HomePage;
