// src/actions.ts

import { Product, ProductAction } from "./type";


export const fetchProductsRequest = (): ProductAction => ({
  type: 'FETCH_PRODUCTS_REQUEST',
});

export const fetchProductsSuccess = (products: Product[]): ProductAction => ({
  type: 'FETCH_PRODUCTS_SUCCESS',
  payload: products,
});

export const fetchProductsFailure = (error: string): ProductAction => ({
  type: 'FETCH_PRODUCTS_FAILURE',
  payload: error,
});
