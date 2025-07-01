import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDollarSign, FaMousePointer, FaBook, FaChartLine } from 'react-icons/fa';

const AdminHomePage = () => {
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    totalClicks: 0,
    totalCourses: 0,
    recentClicks: [],
    topCourses: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('userToken');

  const fetchRevenueData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users/revenue`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRevenueData(response.data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch revenue data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-8">Loading revenue data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Revenue Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaDollarSign size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${revenueData.totalRevenue}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaMousePointer size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-gray-900">{revenueData.totalClicks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaBook size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{revenueData.totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 text-orange-600">
              <FaChartLine size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Revenue/Course</p>
              <p className="text-2xl font-bold text-gray-900">
                ${revenueData.totalCourses > 0 ? (revenueData.totalRevenue / revenueData.totalCourses).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Clicks */}
        <div className="bg-white rounded-lg shadow-md border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Recent Clicks</h2>
          </div>
          <div className="p-6">
            {revenueData.recentClicks.length > 0 ? (
              <div className="space-y-4">
                {revenueData.recentClicks.map((course) => (
                  <div key={course._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium text-gray-900">{course.name}</p>
                      <p className="text-sm text-gray-600">
                        {course.domain?.name} • {course.section?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Last clicked: {new Date(course.lastClicked).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${course.revenue}</p>
                      <p className="text-sm text-gray-600">{course.clicks} clicks</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent clicks</p>
            )}
          </div>
        </div>

        {/* Top Performing Courses */}
        <div className="bg-white rounded-lg shadow-md border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Top Performing Courses</h2>
          </div>
          <div className="p-6">
            {revenueData.topCourses.length > 0 ? (
              <div className="space-y-4">
                {revenueData.topCourses.map((course, index) => (
                  <div key={course._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{course.name}</p>
                        <p className="text-sm text-gray-600">
                          {course.domain?.name} • {course.section?.name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${course.revenue}</p>
                      <p className="text-sm text-gray-600">{course.clicks} clicks</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No courses with revenue yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;