import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StarRating from "./StarRating";
import { fetchBookDetails, postBookReview } from "../utils/api";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const ReviewPage1 = () => {
  const menuItems = [
    { name: "Home", link: "/dashboard", icon: HomeIcon },
    { name: "My Bookshelf", link: "/MyBookshelfPage", icon: BookOpenIcon },
    { name: "Friends", link: "/friends", icon: UsersIcon },
    { name: "Logout", link: "/logout", icon: ArrowRightOnRectangleIcon },
  ];
  const { bookId } = useParams();
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const getBookDetails = async () => {
      try {
        const data = await fetchBookDetails(userId, bookId); // Call API function here

        if (!data || Object.keys(data).length === 0) {
          setError("No book data found.");
          setLoading(false);
          return;
        }

        setBookDetails(data);

        // Set review if it exists in the data; otherwise, leave it empty
        setReview(data.review || "");
        setRating(data.rating || 0); // Set initial rating if available
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    getBookDetails();
  }, [bookId]);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }
  const handleClearRating = () => setRating(0);

  const handlePostReview = async () => {
    try {
      const response = await postBookReview(userId, bookId, review, rating);
      setMessage(response.message);
      setReview("");
      setRating(0);
      alert("Review has been posted successfully");
      navigate("/MyBookshelfPage"); // Redirect to MyBookshelfPage
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleClearReview = () => {
    setReview(""); // Clears the review text
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className=" flex-1 mr-8">
        {/* Header */}
        <Header menuItems={menuItems} />
      </div>
      {/* Main Content */}
      <div className="p-4 max-w-4xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {bookDetails.title}'s Review
        </h1>

        {/* Book Details */}
        <div className="flex mt-4">
          <img
            src={bookDetails.coverImage}
            alt={bookDetails.title}
            className="w-32 h-48 rounded-lg"
          />
          <div className="ml-6 flex flex-col justify-start">
            <h2 className="text-2xl font-semibold text-gray-700">
              {bookDetails.title}
            </h2>
            <p className="text-lg text-gray-500">
              by{" "}
              {Array.isArray(bookDetails.author)
                ? bookDetails.author.join(", ")
                : "Unknown Author"}
            </p>
          </div>
        </div>

        {/* Rating */}
        <div className="mt-2">
          <label className="block text-gray-600 text-lg mb-2">My Rating</label>
          <div className="flex items-center space-x-2">
            <StarRating value={rating} onChange={setRating} />
            <button
              className="text-blue-500 text-sm hover:underline"
              onClick={handleClearRating}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Review Textbox */}
        <div className="mt-4">
          <label className="block text-gray-600 text-lg">
            Write your review
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-2/3 mt-2 p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
            rows="5"
            maxLength={500}
            placeholder="Share your thoughts about the book..."
          />
          <p className="text-right text-sm text-gray-500 mt-1">
            {review.length}/500 characters
          </p>
        </div>

        {/* Post and Clear Buttons */}
        <div className="flex mt-4 space-x-4">
          <button
            onClick={handlePostReview}
            className="px-4 py-2 bg-slate-500 text-white text-sm rounded-lg shadow hover:bg-blue-400"
          >
            Post
          </button>
          <button
            onClick={handleClearReview}
            className="px-4 py-2 bg-slate-500 text-white text-sm rounded-lg shadow hover:bg-blue-400"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage1;
