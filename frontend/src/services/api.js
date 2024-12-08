import axios from "axios";
//Centralised axios server 5000 define in .env

const baseURL = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default baseURL;
