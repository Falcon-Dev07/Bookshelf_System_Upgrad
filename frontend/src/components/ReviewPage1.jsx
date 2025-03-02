import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import StarRating from "./StarRating";
import {
  fetchBookDetails,
  postBookReview,
  updateUserBookRating,
} from "../utils/api";
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
    // { name: "Friends", link: "/friends", icon: UsersIcon },
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
  const location = useLocation();
  const readOnly = location.state?.readOnly || false; // Determine read-only mode

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

  const handleRatingChange = async (newRating) => {
    try {
      const updatedBook = await updateUserBookRating(userId, bookId, newRating); // Call backend API
      setRating(newRating); // Update rating in state
      setBookDetails(updatedBook); // Update book details with new avg rating
    } catch (error) {
      console.error("Error updating rating:", error.message);
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
          <div className="ml-6 flex flex-col justify-start w-full">
            <h2 className="text-2xl font-semibold text-gray-700">
              {bookDetails.title}
            </h2>
            <p className="text-lg text-gray-500">
              by{" "}
              {Array.isArray(bookDetails.author)
                ? bookDetails.author.join(", ")
                : "Unknown Author"}
            </p>
            {/* Rating */}
            <div className="flex items-center space-x-2 mt-2">
              <label className="block text-gray-600 text-lg mb-2">
                My Rating
              </label>
              {/*<StarRating value={rating} onChange={handleRatingChange} />*/}
              <StarRating
                value={rating}
                onChange={!readOnly ? handleRatingChange : null}
                readOnly={readOnly}
              />
              {!readOnly && ( // Show the Clear button only if not in readonly mode
                <button
                  className="text-blue-500 text-sm hover:underline"
                  onClick={handleClearRating}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Review Textbox */}
        <div className="mt-6">
          <label className="block text-gray-600 text-lg">
            {readOnly ? "Your review" : "Write your review"}
          </label>
          <textarea
            value={review}
            onChange={!readOnly ? (e) => setReview(e.target.value) : null} // Enable editing only if not readonly
            className="w-2/3 mt-2 p-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300"
            rows="5"
            maxLength={500}
            placeholder="Share your thoughts about the book..."
            readOnly={readOnly} // Disables editing
          />
          {!readOnly && ( // Character count only displayed in editable mode
            <p className="text-right text-sm text-gray-500 mt-1">
              {review.length}/500 characters
            </p>
          )}
        </div>

        {/* Post and Clear Buttons */}
        {!readOnly && (
          <div className="flex mt-0 space-x-4">
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
        )}

        {readOnly && (
          <div className="flex mt-4 space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg shadow hover:bg-gray-400"
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage1;
