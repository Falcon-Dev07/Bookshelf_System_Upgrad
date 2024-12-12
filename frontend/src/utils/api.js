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

//fetch book details only using bookId and userid for Review page
export const fetchBookDetails = async (userId, bookId) => {
  try {
    const response = await baseURL.get(`/api/books/${userId}/${bookId}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetchBookDetails:", error.message);
    throw new Error("Failed to fetch book details.");
  }
};

//add review into databse
export const postBookReview = async (userId, bookId, reviewText) => {
  try {
    const response = await baseURL.post(`/api/books/review/${bookId}`, {
      userId,
      reviewText,
    });
    return response.data; // Return the response data
  } catch (error) {
    // Handle error response from the server
    const errorMessage =
      error.response?.data?.message || "Failed to post the review.";
    throw new Error(errorMessage);
  }
};

export const deleteUserBook = async (userId, bookId) => {
  await baseURL.delete(`/api/books/${userId}/${bookId}`);
};

export const updateUserBookRating = async (userId, bookId, rating) => {
  const response = await baseURL.patch(`/api/books/${userId}/${bookId}`, {
    rating,
  });
  return response.data;
};
