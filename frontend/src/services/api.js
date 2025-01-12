import axios from "axios";
//Centralised axios server 5000 define in .env

/*const baseURL = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});*/

// Determine the backend URL dynamically based on the environment
const baseURL = axios.create({
  baseURL:
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_BACKEND_URL // Use deployed backend URL
      : process.env.REACT_APP_BASE_URL, // Use local backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default baseURL;
