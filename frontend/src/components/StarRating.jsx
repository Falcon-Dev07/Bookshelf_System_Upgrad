import React from "react";

const StarRating = ({ value, onChange, readOnly }) => {
  const handleStarClick = (newRating) => {
    if (!readOnly && typeof onChange === "function") {
      onChange(newRating);
    }
  };
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          xmlns="http://www.w3.org/2000/svg"
          className={`w-4 h-4 cursor-pointer ${
            star <= value ? "text-yellow-300" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
          /*onClick={() => onChange(star)}*/
          onClick={() => handleStarClick(star)}
          style={{ cursor: readOnly ? "not-allowed" : "pointer" }}
        >
          <path d="M12 .587l3.668 7.431 8.215 1.194-5.937 5.786 1.4 8.163L12 18.897l-7.346 3.864 1.4-8.163L.116 9.212l8.215-1.194z" />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
