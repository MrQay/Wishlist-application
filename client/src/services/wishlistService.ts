import axios from "axios";
import { Wishlist } from "../../../server/src/model/wishlist.model";
import Cookies from "js-cookie";

const baseURL = "http://localhost:8080/wishlists";
const authToken = Cookies.get("authToken")
// Create a new wishlist
export const createWishlist = async (wishlist: {
  title: string;
  description: string;
}): Promise<Wishlist> => {
  const response = await axios.post(`${baseURL}/wishlist`, wishlist, {
    headers: {
      Authorization: authToken,
    },
  });
  if (response.status === 201) {
    return response.data;
  } else {
    throw new Error("Failed to create wishlist");
  }
};

// Retrieve all wishlists for a specific user
export const getWishlistsForUser = async (
): Promise<Wishlist[]> => {
  const response = await axios.get(`${baseURL}/wishlists`, {
    headers: {
      Authorization: authToken,
    },
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to retrieve wishlists for user");
  }
};

// Retrieve a single wishlist by its ID
export const getWishlist = async (id: number): Promise<Wishlist> => {
  const response = await axios.get(`${baseURL}/wishlist/${id}`, {
    headers: {
      Authorization: authToken,
    },
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to retrieve wishlist");
  }
};

// Delete a wishlist by its ID
export const deleteWishlist = async (id: number): Promise<void> => {
  const response = await axios.delete(`${baseURL}/wishlist/${id}`, {
    headers: {
      Authorization: authToken,
    },
  });
  if (response.status === 200) {
    return;
  } else {
    throw new Error("Failed to delete wishlist");
  }
};

// Update details of an existing wishlist
export const updateWishlist = async (
  id: number,
  wishlist: { title?: string; description?: string; date?: string }
): Promise<Wishlist> => {
  const response = await axios.patch(`${baseURL}/wishlist/${id}`, wishlist, {
    headers: {
      Authorization: authToken,
    },
  });
  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error("Failed to update wishlist");
  }
};
