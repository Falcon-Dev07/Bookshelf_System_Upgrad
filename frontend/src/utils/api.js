import axios from "axios";
import baseURL from "../services/api";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

// this api retruns the book result in search bar
export const fetchBooks = async (query) => {
  try {
    const response = await axios.get(
      `${GOOGLE_BOOKS_API}?q=${query}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
    );
    return response.data.items; // Return the list of books
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
};

export const fetchUserBooks = async (userId) => {
  const response = await baseURL.get(`/api/books/${userId}`);
  return response.data;
};

export const deleteUserBook = async (userId, bookId) => {
  console.log("Frontend(api.js) - User ID:", userId, "Book ID:", bookId);
  await baseURL.delete(`/api/books/${userId}/${bookId}`);
};

export const updateUserBookRating = async (userId, bookId, rating) => {
  const response = await baseURL.patch(`/api/books/${userId}/${bookId}`, {
    rating,
  });
  console.log("User ID:", userId, "Book ID:", bookId); //log to check
  return response.data;
};
