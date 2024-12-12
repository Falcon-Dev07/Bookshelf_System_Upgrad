/*import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { addOrUpdateReview } from "../utils/api";
import baseURL from "../services/api";

const ReviewPage = ({ userId }) => {
  const { bookId } = useParams();
  const navigate = useNavigate();
  //const userId = localStorage.getItem("userId");

  // State to store book details and review data
  const [book, setBook] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  // Fetch book details from the backend
  const fetchBookDetails = async () => {
    try {
      console.log("Review Gogle id before api call", bookId);
      const response = await baseURL.get(`/api/books/${bookId}`);
      console.log("API Response:", response);
      console.log("Review Gogle id after api call", bookId);
      // If the response is successful, set the book details to state
      setBook(response.data);
      console.log("API Response:", response);
    } catch (error) {
      // Log the error if the request fails
      console.error("Error fetching book details:", error?.response || error);
      console.error("Error fetching book details:", error);
    }
  };

  useEffect(() => {
    console.log("Initial googleId in useEffect:", bookId);
    fetchBookDetails();
  }, [bookId]); // Only re-run this effect when googleId changes

  // Function to handle review submission
  const handlePost = async () => {
    await addOrUpdateReview(bookId, userId, reviewText, rating);
    alert("Review submitted!");
    navigate("/view_review"); // Redirect after posting the review
  };

  const clearRating = () => setRating(0);

  if (!book) {
    return <div>Loading book details...</div>; // Show loading message while fetching book
  }

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-5">{`${book.title}'s Review`}</h1>
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/3">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-auto rounded shadow"
          />
        </div>
        <div className="w-full md:w-2/3 px-5">
          <h2 className="text-xl font-semibold mb-2">{book.title}</h2>
          <p className="text-gray-600 mb-5">
            Author: Author: {book.author?.join(", ") || "Unknown Author"}
          </p>
          <div className="flex items-center mb-5">
            <label className="text-gray-700 mr-3">My Rating:</label>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className={`cursor-pointer ${
                    index < rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => setRating(index + 1)}
                >
                  ★
                </span>
              ))}
            </div>
            <button
              className="ml-3 text-sm text-red-500 hover:underline"
              onClick={clearRating}
            >
              Clear
            </button>
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 mb-2">
              Write Your Review:
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="5"
              className="w-full border border-gray-300 p-3 rounded"
              maxLength="500"
            />
            <p className="text-sm text-gray-500">{`${reviewText.length}/500 characters`}</p>
          </div>
          <button
            className="bg-green-500 text-white px-5 py-2 rounded hover:bg-green-600"
            onClick={handlePost}
          >
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;*/
