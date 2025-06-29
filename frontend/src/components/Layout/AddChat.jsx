import React, { useState } from 'react'


const AddChat = () => {
  const[searchTerm,setSearchTerm]=useState("");
  const handleSearch=(e)=>{
    e.preventDefault();
    console.log("Search Term:",searchTerm);
  }
  return (
    <div>
      <form onSubmit={handleSearch} className="w-full flex items-center justify-center px-4">
        <div className="relative w-full max-w-2xl">
        <textarea
            rows={1}
            maxLength={500}
            placeholder="Type your message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-100 px-4 py-3 pr-20 rounded-full w-full text-sm text-gray-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200 transition resize-none overflow-y-auto leading-tight scrollbar-hide"
            style={{ maxHeight: "6.5rem" }} // ~4 lines
          />



          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black hover:bg-gray-900 text-white text-sm px-5 py-2 rounded-full shadow transition duration-200"
          >
            Add
          </button>
        </div>
      </form>


    </div>
  )
}

export default AddChat