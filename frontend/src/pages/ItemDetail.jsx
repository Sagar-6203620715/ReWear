import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiArrowLeft, 
  FiHeart, 
  FiShare2, 
  FiUser, 
  FiMapPin, 
  FiPackage,
  FiXCircle,
  FiCheckCircle
} from 'react-icons/fi';
import { createSwap } from '../redux/slices/swapsSlice';
import axios from 'axios';

const ItemDetail = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  
  const [item, setItem] = useState(null);
  const [uploader, setUploader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchItemDetails();
  }, [itemId]);

  const fetchItemDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/items/${itemId}`
      );
      setItem(response.data.item);
      
      // Fetch uploader details if available
      if (response.data.item.user) {
        // Handle both string ID and populated user object
        const userId = typeof response.data.item.user === 'string' 
          ? response.data.item.user 
          : response.data.item.user._id;
          
        if (userId) {
          try {
            const uploaderResponse = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}`
            );
            setUploader(uploaderResponse.data);
          } catch (uploaderErr) {
            console.warn('Failed to fetch uploader details:', uploaderErr);
            // Don't fail the whole request if uploader fetch fails
          }
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch item details');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setActionLoading(true);
    try {
      // Handle both string ID and populated user object
      const recipientUserId = typeof item.user === 'string' 
        ? item.user 
        : item.user._id;
        
      await dispatch(createSwap({
        recipientItemId: itemId,
        recipientUserId: recipientUserId,
        initiatorItemId: null // This will need to be selected by user
      })).unwrap();
      
      setShowSwapModal(false);
      navigate('/dashboard?tab=swaps');
    } catch (err) {
      setError(err.message || 'Failed to create swap request');
    } finally {
      setActionLoading(false);
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Like New': return 'bg-green-100 text-green-800';
      case 'Excellent': return 'bg-blue-100 text-blue-800';
      case 'Good': return 'bg-yellow-100 text-yellow-800';
      case 'Fair': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityStatus = () => {
    if (!item?.isActive) return { status: 'Unavailable', color: 'bg-red-100 text-red-800', icon: FiXCircle };
    if (item?.isReserved) return { status: 'Reserved', color: 'bg-yellow-100 text-yellow-800', icon: FiClock };
    return { status: 'Available', color: 'bg-green-100 text-green-800', icon: FiCheckCircle };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'This item may have been removed or is no longer available.'}</p>
          <Link
            to="/browse"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Other Items
          </Link>
        </div>
      </div>
    );
  }

  const availability = getAvailabilityStatus();
  const AvailabilityIcon = availability.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 mr-2" />
            Back to Browse
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <img
                src={item.images && item.images[selectedImage] ? item.images[selectedImage] : item.image}
                alt={item.title}
                className="w-full h-96 object-cover"
              />
            </div>

            {/* Thumbnail Gallery */}
            {item.images && item.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === index ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{item.title}</h1>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <FiHeart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <FiShare2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(item.condition)}`}>
                  {item.condition}
                </span>
                <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${availability.color}`}>
                  <AvailabilityIcon className="w-4 h-4 mr-1" />
                  {availability.status}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
            </div>

            {/* Item Details */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Category</span>
                  <p className="font-medium">{item.category}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Size</span>
                  <p className="font-medium">{item.size}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Brand</span>
                  <p className="font-medium">{item.brand || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Material</span>
                  <p className="font-medium">{item.material || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Color</span>
                  <p className="font-medium">{item.color || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Listed</span>
                  <p className="font-medium">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Uploader Info */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploader Information</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FiUser className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {uploader?.name || (typeof item.user === 'object' ? item.user.name : 'Unknown User')}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <FiMapPin className="w-4 h-4 mr-1" />
                    {uploader?.profile?.location || item.location || 'Location not specified'}
                  </p>
                </div>
              </div>
              
              {uploader && (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{uploader.stats?.itemsListed || 0}</p>
                    <p className="text-sm text-gray-500">Items Listed</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{uploader.stats?.itemsSwapped || 0}</p>
                    <p className="text-sm text-gray-500">Items Swapped</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-900">{uploader.stats?.totalSwaps || 0}</p>
                    <p className="text-sm text-gray-500">Total Swaps</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {item.isActive && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Get This Item</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowSwapModal(true)}
                    disabled={!user || user._id === (typeof item.user === 'string' ? item.user : item.user._id)}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <FiPackage className="w-5 h-5 mr-2" />
                    Swap with Item
                  </button>
                  
                  {(!user || user._id === (typeof item.user === 'string' ? item.user : item.user._id)) && (
                    <p className="text-sm text-gray-500 text-center">
                      {!user ? 'Please log in to interact with this item' : 'You cannot swap with your own item'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Swap Request Modal */}
        {showSwapModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Swap</h3>
              <p className="text-gray-600 mb-4">
                You're requesting to swap for "{item.name}". You'll need to offer an item in return.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSwapModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSwapRequest}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetail; 