// src/types.ts

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    image_url: string;
  }
  
  export type ProductState = {
    products: Product[];
    loading: boolean;
    error: string | null;
  };
  
  export type ProductAction =
    | { type: 'FETCH_PRODUCTS_REQUEST' }
    | { type: 'FETCH_PRODUCTS_SUCCESS'; payload: Product[] }
    | { type: 'FETCH_PRODUCTS_FAILURE'; payload: string };
  