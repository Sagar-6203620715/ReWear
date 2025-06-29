// RatingForm.jsx
import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const RatingForm = ({ course, onClose }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRating || !reviewText.trim()) return;

    const newReview = {
      rating: selectedRating,
      text: reviewText.trim(),
    };

    setReviews((prev) => [...prev, newReview]);
    setSelectedRating(0);
    setReviewText('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center backdrop-blur-sm"
    >
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold mb-4 text-center text-gray-800">
          {course.name} - Rate & Review
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer text-2xl transition ${
                  selectedRating >= star ? 'text-yellow-500' : 'text-gray-300'
                }`}
                onClick={() => setSelectedRating(star)}
              />
            ))}
          </div>

          <textarea
            rows="3"
            placeholder="Write your review..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>

          <button
            type="submit"
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Submit Review
          </button>
        </form>

        <hr className="my-4" />
        <h4 className="font-semibold mb-2 text-gray-700">All Reviews</h4>
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center">No reviews yet.</p>
        ) : (
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {reviews.map((review, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center space-x-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-sm ${
                        i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-700">{review.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingForm;
