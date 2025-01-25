import React from 'react';
import Products from './Products';

const Product: React.FC = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="max-w-md w-full px-6 py-8 bg-white rounded-lg shadow-md">
                <Products />
            </div>
        </div>
    );
}

export default Product;