import axios from "axios";

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
