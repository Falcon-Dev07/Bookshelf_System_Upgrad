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

// this api return the book in bookshelftable
export const fetchUserBooks = async (userId) => {
  const response = await baseURL.get(`/api/books/${userId}`);
  return response.data;
};

// Fetch book details by book_ID and User_id for review page

export const fetchBookDetails = async (bookId) => {
  try {
    const userId = localStorage.getItem("userId"); // Retrieve the userId from local storage

    if (!userId) {
      throw new Error("User not authenticated. User ID not found.");
    }

    // Make the API request, sending the userId in the Authorization header
    const response = await baseURL.get(`/api/books/${bookId}`, {
      headers: {
        Authorization: `Bearer ${userId}`, // Send the userId in the Authorization header
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error in fetchBookDetails:", error.message);
    throw new Error("Failed to fetch book details.");
  }
};

/* fetch book details only using bookId
export const fetchBookDetails = async (bookId) => {
  try {
    //console.log("Frontend api.js Book ID:", bookId);
    console.log("Frontend API call to:", `/api/books/${bookId}`);
    const response = await baseURL.get(`/api/books/${bookId}`);
    console.log("Response from API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in fetchBookDetails:", error.message);
    throw new Error("Failed to fetch book details.");
  }
};*/

export const deleteUserBook = async (userId, bookId) => {
  await baseURL.delete(`/api/books/${userId}/${bookId}`);
};

export const updateUserBookRating = async (userId, bookId, rating) => {
  const response = await baseURL.patch(`/api/books/${userId}/${bookId}`, {
    rating,
  });
  return response.data;
};
