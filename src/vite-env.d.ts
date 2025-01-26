/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_STRIPE_KEY: string; // Add your custom environment variables here
    // Add more environment variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  