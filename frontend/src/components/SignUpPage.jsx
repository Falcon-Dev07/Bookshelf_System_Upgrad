import React, { useState } from "react";
import Header from "./Header";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// Determine the backend URL dynamically
const backendUrl =
  process.env.REACT_APP_ENV === "production"
    ? process.env.REACT_APP_BACKEND_URL
    : process.env.REACT_APP_BASE_URL;

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const response = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    /*const response = await fetch("http://localhost:5000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });*/

    if (response.ok) {
      window.location.href = "/login";
    } else {
      alert("Error during sign-up");
    }

    // for password length checking on submiting the form
    if (formData.password.length < 6) {
      alert("Please enter a valid password.");
      return;
    }
  };

  const menuItems = [{ name: "Home", link: "/" }]; // for adding menu to page

  // for checking password visible function
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  // for password length check

  const [errors, setErrors] = useState({ password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate Password Length
    if (name === "password" && value.length < 6) {
      setErrors({
        ...errors,
        password: "Password must be at least 6 characters.",
      });
    } else if (name === "password") {
      setErrors({ ...errors, password: "" });
    }
  };

  //for handling google sign-up

  const handleGoogleSignUp = () => {
    //window.location.href = "http://localhost:5000/auth/google/signup"; //forcefully asking for google id
    window.location.href = `${backendUrl}/auth/google/signup`;
  };

  return (
    <div className="relative z-20">
      <Header menuItems={menuItems} />

      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-semibold text-center mb-6">bookShelf</h1>
          <h2 className="text-xl font-medium text-center mb-4">Sign Up</h2>
          <form onSubmit={handleEmailSignUp}>
            <div className="mb-4">
              <label className="block text-gray-700">Your Name</label>
              <input
                type="text"
                value={formData.name}
                placeholder="First name last name"
                name="name"
                className="w-full px-4 py-2 border rounded-md"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email ID</label>
              <input
                type="email"
                value={formData.email}
                name="email"
                placeholder="Your email id"
                className="w-full px-4 py-2 border rounded-md"
                onChange={handleChange}
                required
              />
            </div>
            <div className=" relative mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type={passwordVisible ? "text" : "password"}
                placeholder="At least 6 characters"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md"
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

            {/* Error Message */}
            {errors.password && (
              <p className="text-red-500 text-sm mb-4">{errors.password}</p>
            )}

            <div className=" relative mb-4">
              <label className="block text-gray-700">Re-enter Password</label>
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                className="w-full px-4 py-2 border rounded-md"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter your password"
                required
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
              >
                {confirmPasswordVisible ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <button
              type="submit"
              //className="w-full py-2 bg-blue-500 text-white rounded-md"
              className={`w-full py-2 px-4 bg-blue-500 text-white rounded-md ${
                errors.password
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600"
              }`}
              disabled={!!errors.password}
            >
              Create Account
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={handleGoogleSignUp}
              className="w-full py-2 bg-red-500 text-white rounded-md"
            >
              Sign Up with Google
            </button>
          </div>

          <p className="text-center mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 underline">
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
