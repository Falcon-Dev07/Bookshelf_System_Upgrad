import axios from "axios";
import getUserId from "../utils/getUserId";

const API = axios.create({ baseURL: "http://localhost:5000" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const addBookToBookshelf = async (book) => {
  const userId = getUserId(); // Dynamically get the userId
  if (!userId) {
    throw new Error("User not logged in or user ID not available");
  }

  return API.post("/api/books/add", {
    userId,
    book,
  });
};
