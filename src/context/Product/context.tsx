/* eslint-disable @typescript-eslint/no-unused-vars */
// src/context.tsx

import React, { createContext, useReducer, useContext, ReactNode } from 'react';
import { productReducer } from './reducer';
import { ProductAction, ProductState } from './type';

interface ProductContextProps {
  state: ProductState;
  dispatch: React.Dispatch<ProductAction>;
}

const ProductContext = createContext<ProductContextProps | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(productReducer, {
    products: [],
    loading: false,
    error: null,
  });


  return (
    <ProductContext.Provider value={{ state, dispatch }}>
      {children}
    </ProductContext.Provider>
  );
};
