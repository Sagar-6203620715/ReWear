import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiUser, 
  FiGift, 
  FiPackage, 
  FiMessageSquare, 
  FiEdit3,
  FiMapPin,
  FiPhone,
  FiAward,
  FiCalendar,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiTrash2
} from 'react-icons/fi';
import { fetchCurrentUser } from '../redux/slices/authSlice';
import axios from 'axios';

const UserDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [deletingItem, setDeletingItem] = useState(null);

  useEffect(() => {
    if (!user) {
      setError('Please log in to access your dashboard.');
      setLoading(false);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }
    
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      
      if (!token) {
        setError('No authentication token found. Please log in again.');
        setLoading(false);
        return;
      }
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/dashboard`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log('Dashboard data received:', response.data);
      setDashboardData(response.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      if (err?.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError(err?.response?.data?.message || 'Failed to fetch dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item? This action cannot be undone.')) {
      return;
    }

    setDeletingItem(itemId);
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/items/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Immediately remove the item from local state
      setDashboardData(prev => ({
        ...prev,
        userItems: prev.userItems.filter(item => item._id !== itemId)
      }));
      
      alert('Item removed successfully!');
    } catch (err) {
      console.error('Error deleting item:', err);
      alert(err?.response?.data?.message || 'Failed to remove item. Please try again.');
    } finally {
      setDeletingItem(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="w-4 h-4" />;
      case 'accepted': return <FiCheckCircle className="w-4 h-4" />;
      case 'completed': return <FiAward className="w-4 h-4" />;
      case 'rejected': return <FiXCircle className="w-4 h-4" />;
      case 'cancelled': return <FiAlertCircle className="w-4 h-4" />;
      default: return <FiClock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={fetchDashboardData}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <FiUser className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {dashboardData?.user?.name || user?.name}!
                </h1>
                <p className="text-gray-600">Manage your profile, items, and swaps</p>
              </div>
            </div>
            <Link
              to="/list-item"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <FiPackage className="w-5 h-5" />
              <span>List New Item</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FiPackage className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Items Listed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.userItems?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FiTrendingUp className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Items Swapped</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.user?.stats?.itemsSwapped || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <FiMessageSquare className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Swaps</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData?.pendingSwaps || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: FiUser },
                { id: 'items', label: 'My Items', icon: FiPackage },
                { id: 'swaps', label: 'My Swaps', icon: FiMessageSquare },
                { id: 'profile', label: 'Profile', icon: FiEdit3 }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Items</h3>
                    <div className="space-y-3">
                      {dashboardData?.userItems?.length > 0 ? (
                        dashboardData.userItems.map((item) => (
                          <div key={item._id} className="group flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md">
                            <div className="relative overflow-hidden rounded-lg">
                              <img 
                                src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150x150?text=No+Image'} 
                                alt={item.name}
                                className="w-12 h-12 object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 group-hover:text-green-600 transition-colors duration-200">{item.name}</p>
                              <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">{item.condition}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                item.status === 'available' ? 'bg-green-100 text-green-800 group-hover:bg-green-200' : 
                                item.status === 'approved' ? 'bg-blue-100 text-blue-800 group-hover:bg-blue-200' :
                                item.status === 'pending' ? 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200' :
                                'bg-gray-100 text-gray-800 group-hover:bg-gray-200'
                              }`}>
                                {item.status === 'available' ? 'Active' : item.status}
                              </span>
                              <button
                                onClick={() => deleteItem(item._id)}
                                disabled={deletingItem === item._id}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-all duration-200 transform hover:scale-110 disabled:opacity-50"
                                title="Remove item"
                              >
                                <FiTrash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No items listed yet</p>
                      )}
                    </div>
                  </div>

                  {/* Recent Swaps */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Swaps</h3>
                    <div className="space-y-3">
                      {dashboardData?.userSwaps?.length > 0 ? (
                        dashboardData.userSwaps.map((swap) => (
                          <div key={swap._id} className="group p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md">
                            <div className="flex items-center justify-between mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${getStatusColor(swap.status)}`}>
                                {swap.status}
                              </span>
                              <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                                {new Date(swap.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                              {swap.initiator._id === user?._id ? 'You' : swap.initiator.name} ↔ {swap.recipient._id === user?._id ? 'You' : swap.recipient.name}
                            </p>
                            <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                              {swap.initiatorItem.name} ↔ {swap.recipientItem.name}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No swaps yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Items Tab */}
            {activeTab === 'items' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Items</h3>
                  <Link
                    to="/list-item"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add New Item
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboardData?.userItems?.length > 0 ? (
                    dashboardData.userItems.map((item) => (
                      <div key={item._id} className="group relative">
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group-hover:shadow-2xl">
                          <div className="relative overflow-hidden">
                            <img 
                              src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150x150?text=No+Image'} 
                              alt={item.name}
                              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            
                            {/* Status Badge */}
                            <div className="absolute top-2 right-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                item.status === 'available' ? 'bg-green-100 text-green-800 group-hover:bg-green-200' : 
                                item.status === 'approved' ? 'bg-blue-100 text-blue-800 group-hover:bg-blue-200' :
                                item.status === 'pending' ? 'bg-yellow-100 text-yellow-800 group-hover:bg-yellow-200' :
                                'bg-gray-100 text-gray-800 group-hover:bg-gray-200'
                              }`}>
                                {item.status === 'available' ? 'Active' : item.status}
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-200">{item.name}</h4>
                            <p className="text-sm text-gray-600 mb-2 group-hover:text-gray-700 transition-colors duration-200">{item.description}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-900 group-hover:text-gray-700 transition-colors duration-200">{item.category}</span>
                            </div>
                            <div className="mt-3 flex justify-end">
                              <button
                                onClick={() => deleteItem(item._id)}
                                disabled={deletingItem === item._id}
                                className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <FiTrash2 className="w-4 h-4" />
                                <span>{deletingItem === item._id ? 'Removing...' : 'Remove'}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
                      <p className="text-gray-500 mb-4">Start by listing your first item</p>
                      <Link
                        to="/list-item"
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        List Your First Item
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Swaps Tab */}
            {activeTab === 'swaps' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">My Swaps</h3>
                <div className="space-y-4">
                  {dashboardData?.userSwaps?.length > 0 ? (
                    dashboardData.userSwaps.map((swap) => (
                      <div key={swap._id} className="group bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(swap.status)}
                            <span className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${getStatusColor(swap.status)}`}>
                              {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                            {new Date(swap.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-3 group/item">
                            {swap.initiatorItem ? (
                              <>
                                <div className="relative overflow-hidden rounded-lg">
                                  <img 
                                    src={swap.initiatorItem.images && swap.initiatorItem.images.length > 0 ? swap.initiatorItem.images[0] : 'https://via.placeholder.com/150x150?text=No+Image'} 
                                    alt={swap.initiatorItem.name}
                                    className="w-16 h-16 object-cover transition-transform duration-300 group-hover/item:scale-110"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900 group-hover/item:text-green-600 transition-colors duration-200">{swap.initiatorItem.name}</p>
                                  <p className="text-sm text-gray-600 group-hover/item:text-gray-700 transition-colors duration-200">
                                    {swap.initiator._id === user?._id ? 'You' : swap.initiator.name}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center space-x-3">
                                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <FiGift className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Points Used</p>
                                  <p className="text-sm text-gray-600">
                                    {swap.initiator._id === user?._id ? 'You' : swap.initiator.name}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-3 group/item">
                            <div className="relative overflow-hidden rounded-lg">
                              <img 
                                src={swap.recipientItem.images && swap.recipientItem.images.length > 0 ? swap.recipientItem.images[0] : 'https://via.placeholder.com/150x150?text=No+Image'} 
                                alt={swap.recipientItem.name}
                                className="w-16 h-16 object-cover transition-transform duration-300 group-hover/item:scale-110"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 group-hover/item:text-green-600 transition-colors duration-200">{swap.recipientItem.name}</p>
                              <p className="text-sm text-gray-600 group-hover/item:text-gray-700 transition-colors duration-200">
                                {swap.recipient._id === user?._id ? 'You' : swap.recipient.name}
                              </p>
                            </div>
                          </div>
                        </div>

                        {swap.points > 0 && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 group-hover:bg-green-100 transition-colors duration-200">
                            <p className="text-sm text-green-800 group-hover:text-green-900 transition-colors duration-200">
                              <FiGift className="inline w-4 h-4 mr-1" />
                              Points involved: {swap.points}
                            </p>
                          </div>
                        )}

                        {swap.messages?.length > 0 && (
                          <div className="bg-gray-50 rounded-lg p-3 group-hover:bg-gray-100 transition-colors duration-200">
                            <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                              {swap.messages.length} message{swap.messages.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <FiMessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No swaps yet</h3>
                      <p className="text-gray-500 mb-4">Start swapping with other users</p>
                      <Link
                        to="/browse"
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Browse Items
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <p className="text-gray-900">{dashboardData?.user?.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <p className="text-gray-900">{dashboardData?.user?.email}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <p className="text-gray-900">
                      {dashboardData?.user?.profile?.bio || dashboardData?.user?.bio || 'No bio added yet'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FiMapPin className="w-4 h-4 mr-2" />
                        Location
                      </label>
                      <p className="text-gray-900">
                        {dashboardData?.user?.profile?.location || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <FiPhone className="w-4 h-4 mr-2" />
                        Phone
                      </label>
                      <p className="text-gray-900">
                        {dashboardData?.user?.profile?.phone || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FiCalendar className="w-4 h-4 mr-2" />
                      Member Since
                    </label>
                    <p className="text-gray-900">
                      {new Date(dashboardData?.user?.stats?.memberSince || dashboardData?.user?.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="pt-4">
                    <Link
                      to="/edit-profile"
                      className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors inline-block"
                    >
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 