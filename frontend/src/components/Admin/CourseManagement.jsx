import React from 'react'
import { Link } from 'react-router-dom'

const CourseManagement = () => {

  const courses=[
    {
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
      domain: "Web Development",   // references Domain
      section: "Tech"              // references Section
    }
    
  ];

  const handleDelete=(id)=>{
    if(window.confirm("are you sure you want to delete")){
      console.log("delete course with id",id);
    }
  }
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Course Management</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Name</th>

            </tr>
          </thead>
          <tbody>
            {courses.length>0?(
              courses.map((course)=>(
                <tr 
                  key={course._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {course.name}
                  </td>
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {course.name}
                  </td>
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {course.name}
                  </td>
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {course.name}
                  </td>
                  <td className="p-4">
                    <Link to={`/admin/courses/${course._id}/edit`} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600" >
                      Edit
                    </Link>
                    <button onClick={()=>handleDelete(course._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))
            ):(
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  no products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CourseManagement