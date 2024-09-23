import axios from 'axios';

const BASE_URL = 'http://localhost:8080/wishlist';

// Adds a new product to the wishlist
export const addProductToWishlist = async (wishlistId: number, productData: any) => {
  return axios.post(`${BASE_URL}/${wishlistId}/products`, productData);
};

// Retrieves all products from a specific wishlist
export const getProductsFromWishlist = async (wishlistId: number) => {
  return axios.get(`${BASE_URL}/${wishlistId}/products`);
};

// Retrieves a single product from the wishlist by its ID
export const getProductFromWishlist = async (wishlistId: number, productId: number) => {
  return axios.get(`${BASE_URL}/${wishlistId}/products/${productId}`);
};

// Updates an existing product in the wishlist
export const updateProductInWishlist = async (wishlistId: number, productId: number, productData: any) => {
  return axios.patch(`${BASE_URL}/${wishlistId}/products/${productId}`, productData);
};

// Deletes a product from the wishlist
export const deleteProductFromWishlist = async (wishlistId: number, productId: number) => {
  return axios.delete(`${BASE_URL}/${wishlistId}/products/${productId}`);
};

// Deletes all products from a specific wishlist
export const deleteAllProductsFromWishlist = async (wishlistId: number) => {
  return axios.delete(`${BASE_URL}/${wishlistId}/products`);
};

// Fetches product details from external API Axesso using a product URL
export const fetchProductDetailsFromAxesso = async (productUrl: string) => {
  return axios.get(`${BASE_URL}/fetchAmazonProdDetails`, {
    params: {
      url: productUrl
    }
  });
};
