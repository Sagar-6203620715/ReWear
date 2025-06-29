import React from 'react'
import { Link } from 'react-router-dom'

const AdminHomePage = () => {
  const courses=[
    {
      _id:123123,
      user:{
        name:"john",
      },
      course:"Apna College",
      status:"purchased",
    }
  ]
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">-Admin Dashboard </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Revenue</h2>
          <p className="text-2xl">$10000</p>
        </div>
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Total Affiliates</h2>
          <p className="text-2xl">1000</p>
          <Link to="/admin/courses" className="text-blue-500 hover:underline">
            Manage Domains
          </Link>
        </div>
        <div className="p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold">Revenue</h2>
          <p className="text-2xl">$10000</p>
          <Link to="/admin/courses" className="text-blue-500 hover:underline">
            Manage Courses
          </Link>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">
          recent links
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="py-3 px-4">course id</th>
                <th className="py-3 px-4">user</th>
                <th className="py-3 px-4">course</th>
                <th className="py-3 px-4">status</th>
              </tr>
            </thead>
            <tbody>
              {courses.length>0?(
                courses.map((course)=>(
                  <tr key={course._id} className="border-b hover:bg-gray-50 cursor-pointer">
                    <td className="p-4">{course._id}</td>
                    <td className="p-4">{course.user.name}</td>
                    <td className="p-4">{course.course}</td>
                    <td className="p-4">{course.status}</td>
                  </tr>
                ))
              ):(
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    no recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminHomePage