import React, { useState } from "react";
import Header from "./Header";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import getUserId from "../utils/getUserId";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // formData contains { email, password }
      });

      if (response.ok) {
        const data = await response.json(); // Assuming the server sends JSON with a token
        //const { token, userId } = data;
        const { token } = data;

        // Save the token in localStorage
        localStorage.setItem("token", token);
        console.log("Token saved to localStorage:", token);

        // Store the user id in localStorage for future use
        const userId = getUserId();
        localStorage.setItem("userId", userId);
        console.log("Decoded User ID:", userId);

        // Redirect to the dashboard
        window.location.href = "/dashboard";
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleGoogleLogin = async (e) => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  const menuItems = [{ name: "Home", link: "/" }]; // for adding menu to page

  // for password visible function

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="relative z-20">
      <Header menuItems={menuItems} />
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-6">Bookshelf</h1>
          <h2 className="text-xl font-semibold text-center mb-4">Log In</h2>
          <form onSubmit={handleEmailLogin}>
            <div className="mb-4">
              <label className="block text-gray-700">Email ID</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 border rounded-md"
                onChange={handleChange}
                required
              />
            </div>
            <div className=" relative mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                className="w-full px-4 py-2 border rounded-md"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
              >
                {passwordVisible ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md"
            >
              Log In
            </button>
          </form>
          <div className="mt-4 text-center">
            <button
              onClick={handleGoogleLogin}
              className="w-full py-2 bg-red-500 text-white rounded-md"
            >
              Log In with Google
            </button>
          </div>
          <p className="text-center mt-4">
            New to Bookshelf?{" "}
            <a href="/signup" className="text-blue-500 underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
