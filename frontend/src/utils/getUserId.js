import { jwtDecode } from "jwt-decode";

const getUserId = () => {
  const token = localStorage.getItem("token"); // Assuming JWT is stored in localStorage
  if (!token) {
    console.error("Token not found in local storage");
    return null;
  }
  try {
    const decodedToken = jwtDecode(token);
    console.log("Decoded Token:", decodedToken); // Debugging
    return decodedToken.userId || decodedToken.id; // Adjust based on your backend's JWT payload
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export default getUserId;
