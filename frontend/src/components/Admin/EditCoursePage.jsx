import React, { useState } from 'react';

const EditCoursePage = () => {
  const [courseData, setCourseData] = useState({
    _id: 123123,
    name: "Apna College-Sigma 8.0",
    price: 5000,
    image: {
      url: "https://picsum.photos/500/500?random=1",
      altText: "Apna College"
    },
    duration: {
      years: 2,
      months: 9
    },
    affiliate_link: "#",
    rating: 4,
    domain: "Web Development",
    section: "Tech"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields
    if (name === "years" || name === "months") {
      setCourseData((prevData) => ({
        ...prevData,
        duration: {
          ...prevData.duration,
          [name]: Number(value)
        }
      }));
    } else if (name === "affiliate_link") {
      setCourseData((prevData) => ({
        ...prevData,
        affiliate_link: value
      }));
    } else {
      setCourseData((prevData) => ({
        ...prevData,
        [name]: name === "price" || name === "rating" ? Number(value) : value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCourseData((prevData) => ({
        ...prevData,
        image: {
          ...prevData.image,
          url: imageUrl,
          file // For uploading later if needed
        }
      }));
    }
  };

  const handleSubmit=(e)=>{
    e.preventDefault();
    console.log(courseData);
  }

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Course</h2>
      <form onSubmit={handleSubmit}>
        {/* Course Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Course Name</label>
          <input
            type="text"
            name="name"
            value={courseData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Course Price</label>
          <input
            type="number"
            name="price"
            value={courseData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Duration */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Course Duration</label>
          <div className="flex gap-4">
            <input
              type="number"
              name="years"
              value={courseData.duration.years}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
            <input
              type="number"
              name="months"
              value={courseData.duration.months}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
        </div>

        {/* Affiliate Link */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Affiliate Link</label>
          <input
            type="text"
            name="affiliate_link"
            value={courseData.affiliate_link}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Domain */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Course Domain</label>
          <input
            type="text"
            name="domain"
            value={courseData.domain}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Section */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Course Section</label>
          <input
            type="text"
            name="section"
            value={courseData.section}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Rating */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Course Rating</label>
          <input
            type="number"
            name="rating"
            value={courseData.rating}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            min={0}
            max={5}
            required
          />
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          <input
            type="file"
            name="image"
            onChange={handleImageUpload}
            className="w-full border border-gray-300 rounded-md p-2"
          />
          {courseData.image?.url && (
            <img
              src={courseData.image.url}
              alt="Course Preview"
              className="mt-4 w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        {/* Submit Button (optional) */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditCoursePage;
