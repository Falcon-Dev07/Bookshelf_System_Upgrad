import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();

  // Determine the backend URL dynamically
  const backendUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_BACKEND_URL
      : process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const handleLogout = async () => {
      try {
        //await fetch("http://localhost:5000/logout", { method: "GET" });
        await fetch(`${backendUrl}/logout`, { method: "GET" });
        localStorage.removeItem("token"); // Clear local storage
        localStorage.removeItem("userId");
        navigate("/"); // Redirect to the home page
      } catch (error) {
        console.error("Error during logout:", error);
      }
    };

    handleLogout();
  }, [navigate]);

  return null; // No UI needed for this component
};

export default LogoutPage;
