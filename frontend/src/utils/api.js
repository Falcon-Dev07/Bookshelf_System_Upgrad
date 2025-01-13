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
export const postBookReview = async (userId, bookId, reviewText, rating) => {
  try {
    const response = await baseURL.post(`/api/books/review/${bookId}`, {
      userId,
      reviewText,
      rating,
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

// Fetch books with status "want_to_read" for the logged-in user
export const fetchWantToReadBooks = async (userId) => {
  //const userId = localStorage.getItem("userId"); // Get the userId from localStorage

  if (!userId) {
    throw new Error("User ID not found");
  }

  const response = await baseURL.get(`api/books/want/status/${userId}`);

  return response.data; // Return the fetched books
};

//Set the Updated book status from want to read page API call
export const updateBookStatus = async (userId, googleId, status) => {
  try {
    const response = await baseURL.post("/api/books/update-status", {
      userId,
      googleId,
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating book status:", error);
    throw error;
  }
};

// Fetch books with the status completed for a user
export const getCompletedBooks = async (userId) => {
  try {
    const response = await baseURL.get(`api/books/status/completed/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching completed books:", error);
    throw error;
  }
};

// Update book status for a user
export const updateStatusFromCompletedBook = async (userId, bookId, status) => {
  try {
    const response = await baseURL.put(`api/books/${userId}/book/${bookId}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating book status:", error);
    throw error;
  }
};

// Fetch currently reading books
export const getCurrentlyReadingBooks = async (userId) => {
  //console.log("Received userId in getCurentlyReadig API:", userId);
  const response = await baseURL.get(
    `api/books/status/currently-reading/${userId}`
  );
  return response.data;
};

// Update book progress
export const updateBookProgress = async (googleId, progress, notes) => {
  const userId = localStorage.getItem("userId"); // Use the userId from localStorage
  //console.log("Sending request with googleId in API:", googleId);
  const response = await baseURL.put(`api/books/status/update-progress`, {
    userId,
    googleId,
    progress,
    notes,
  });
  return response.data;
};

//For changing the status of a book to completed from currently reading
export const markBookAsFinished = async (userId, googleId, status) => {
  try {
    const response = await baseURL.put(`/api/books/status/finish/${userId}`, {
      googleId,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating book status:", error);
    throw error;
  }
};
