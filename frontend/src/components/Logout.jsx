import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await fetch("http://localhost:5000/logout", { method: "GET" });
        localStorage.removeItem("token"); // Clear local storage
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
