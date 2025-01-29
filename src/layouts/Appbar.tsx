/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { ShoppingCart } from "lucide-react"; // Import shopping cart icon
import { Menu, Transition } from "@headlessui/react";
import UserCircleIcon from "@heroicons/react/24/outline/UserCircleIcon";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../config/constants";

interface NavigationItem {
  name: string;
  href: string;
}

const classNames = (...classes: string[]): string =>
  classes.filter(Boolean).join(" ");

export default function Appbar() {
  const navigate = useNavigate();
  const [userNavigation, setUserNavigation] = useState<NavigationItem[]>([]);
  const authenticated = !!localStorage.getItem("token");
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem("token");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/api/users/role`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setIsAdmin(data.isAdmin); // Set state based on role
      } catch (error) {
        console.error("Error fetching role:", error);
        setIsAdmin(false); // Default to non-admin if error occurs
      }
    };

    if (token) {
      checkAdminRole();
    } else {
      setIsAdmin(false); // If no token, assume user is not authenticated
    }
    updateUserNavigation(authenticated);
  }, [authenticated, i18n.language, token]);

  const updateUserNavigation = (isAuthenticated: boolean) => {
    const updatedNavigation = isAuthenticated
      ? [
          { name: t("Profile"), href: "#" },
          { name: t("Sign out"), href: "/logout" },
        ]
      : [
          { name: t("Sign in"), href: "/signin" },
          { name: t("Sign up"), href: "/signup" },
        ];
    setUserNavigation(updatedNavigation);
  };

  return (
    <div className="bg-white">
      <header className="relative">
        {/* Announcement Banner */}
        <p className="flex h-10 items-center justify-center bg-indigo-600 text-sm font-medium text-white">
          Free shipping on all orders above ₹1000!
        </p>

        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile Menu Button */}
            <button className="p-2 text-gray-400 lg:hidden hover:text-gray-600 focus:outline-none">
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
                href="/orders"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                My Orders
              </a>
              <a
                href="/mywishlist"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                My Wishlist
              </a>
              {/* Conditionally render Admin link */}
              {isAdmin && (
                <a
                  href="/admin"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                >
                  Admin Dashboard
                </a>
              )}
            </div>

            {/* Right Section: User Menu and Cart */}
            <div className="flex items-center space-x-6">
              {/* User Menu */}
              <div className="relative">
                <Menu>
                  <Menu.Button className="p-2 text-gray-700 rounded-full hover:text-indigo-600 focus:outline-none">
                    <UserCircleIcon className="h-6 w-6" aria-hidden="true" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Menu.Item key={item.name}>
                          {({ active }) => (
                            <a
                              href={item.href}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              {item.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>

              {/* Cart Icon */}
              <div
                onClick={() => navigate("/cart")}
                className="relative flex items-center justify-center p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
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
            href="/orders"
            className="block text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            My Orders
          </a>
          <a
            href="/mywishlist"
            className="block text-sm font-medium text-gray-700 hover:text-indigo-600"
          >
            My Wishlist
          </a>
          {/* Conditionally render Admin link */}
          {isAdmin && (
            <a
              href="/admin"
              className="block text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              Admin Dashboard
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
