import React from 'react';
import { Link } from 'react-router-dom';

const FailurePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-16 w-16 text-red-500"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-red-600">Something Went Wrong</h1>
        <p className="mt-4 text-lg text-gray-600">
          We're sorry, but your order could not be processed at this time. Please try again later or contact support.
        </p>
        <div className="mt-8">
          <Link
            to="/cart"
            className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
          >
            Go Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FailurePage;
