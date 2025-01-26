/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ShoppingCart } from 'lucide-react'; // Import shopping cart icon
import { useNavigate } from "react-router-dom";

export default function Appbar() {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <header className="relative">
        {/* Announcement Banner */}
        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white">
          Free shipping on all orders above ₹1000!
        </p>

        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile Menu Button */}
            <button className="p-2 text-gray-400 lg:hidden focus:outline-none hover:text-gray-600">
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex-shrink-0">
                <img
                  src="../../public/image.png"
                  alt="Adaa Logo"
                  className="h-8 w-auto"
                />
              </a>
            </div>

            {/* Navigation Links */}
            <div className="hidden lg:flex lg:space-x-8">
              <a
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                Home
              </a>
              <a
                href="/about"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                About
              </a>
              <a
                href="/contact"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                Contact
              </a>
              <a
                href="/orders"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                My Orders
              </a>
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-6">
              <button className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </button>
              <div
                onClick={() => navigate("/cart")}
                className="flex items-center justify-center p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                title="View Cart"
              >
                <ShoppingCart className="w-6 h-6" />
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div className="lg:hidden bg-gray-50">
        <div className="space-y-1 px-4 py-2">
          <a
            href="/"
            className="block text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            Home
          </a>
          <a
            href="/products"
            className="block text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            Products
          </a>
          <a
            href="/about"
            className="block text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            About
          </a>
          <a
            href="/contact"
            className="block text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            Contact
          </a>
          <a
            href="/orders"
            className="block text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            My Orders
          </a>
        </div>
      </div>
    </div>
  );
}
