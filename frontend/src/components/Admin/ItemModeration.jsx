import React, { useState, useEffect } from 'react';
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiEye, 
  FiTrash2, 
  FiFlag,
  FiClock,
  FiUser,
  FiCalendar,
  FiPackage
} from 'react-icons/fi';
import axios from 'axios';

const ItemModeration = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, flagged
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [filter]);

  const fetchItems = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/items?status=${filter}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setItems(response.data.items);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (itemId, action, reason = '') => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/items/${itemId}/${action}`,
        { reason },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Refresh items list
      fetchItems();
      setShowModal(false);
      setSelectedItem(null);
    } catch (err) {
      setError(err?.response?.data?.message || `Failed to ${action} item`);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'flagged': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="w-4 h-4" />;
      case 'approved': return <FiCheckCircle className="w-4 h-4" />;
      case 'rejected': return <FiXCircle className="w-4 h-4" />;
      case 'flagged': return <FiFlag className="w-4 h-4" />;
      default: return <FiClock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Item Moderation</h1>
          <p className="text-gray-600">Review and moderate item listings</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'pending', label: 'Pending Review', count: items.filter(i => i.status === 'pending').length },
                { id: 'flagged', label: 'Flagged Items', count: items.filter(i => i.status === 'flagged').length },
                { id: 'approved', label: 'Approved', count: items.filter(i => i.status === 'approved').length },
                { id: 'rejected', label: 'Rejected', count: items.filter(i => i.status === 'rejected').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    filter === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    filter === tab.id ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500">No items match the current filter criteria.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start space-x-4">
                  {/* Item Image */}
                  <img 
                    src={item.images && item.images.length > 0 ? item.images[0] : ''} 
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  
                  {/* Item Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span>{item.status}</span>
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium">{item.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Size:</span>
                        <p className="font-medium">{item.size}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Condition:</span>
                        <p className="font-medium">{item.condition}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Price:</span>
                        <p className="font-medium">${item.price}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiUser className="w-4 h-4 mr-1" />
                        {item.user?.name || 'Unknown User'}
                      </div>
                      <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowModal(true);
                      }}
                      className="flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <FiEye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                    
                    {item.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAction(item._id, 'approve')}
                          disabled={actionLoading}
                          className="flex items-center justify-center px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors disabled:opacity-50"
                        >
                          <FiCheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setShowModal(true);
                          }}
                          disabled={actionLoading}
                          className="flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          <FiXCircle className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                    
                    {item.status === 'flagged' && (
                      <>
                        <button
                          onClick={() => handleAction(item._id, 'approve')}
                          disabled={actionLoading}
                          className="flex items-center justify-center px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors disabled:opacity-50"
                        >
                          <FiCheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(item._id, 'reject')}
                          disabled={actionLoading}
                          className="flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          <FiTrash2 className="w-4 h-4 mr-1" />
                          Remove
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Item Detail Modal */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Item Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiXCircle className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <img 
                    src={selectedItem.images && selectedItem.images.length > 0 ? selectedItem.images[0] : ''} 
                    alt={selectedItem.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedItem.name}</h3>
                    <p className="text-gray-600 mb-4">{selectedItem.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <p className="font-medium">{selectedItem.category}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Size:</span>
                        <p className="font-medium">{selectedItem.size}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Condition:</span>
                        <p className="font-medium">{selectedItem.condition}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Price:</span>
                        <p className="font-medium">${selectedItem.price}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Brand:</span>
                        <p className="font-medium">{selectedItem.brand || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Material:</span>
                        <p className="font-medium">{selectedItem.material || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedItem.status === 'pending' && (
                    <div className="flex space-x-3 pt-4 border-t">
                      <button
                        onClick={() => handleAction(selectedItem._id, 'approve')}
                        disabled={actionLoading}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <FiCheckCircle className="w-4 h-4 mr-2 inline" />
                        Approve Item
                      </button>
                      <button
                        onClick={() => handleAction(selectedItem._id, 'reject')}
                        disabled={actionLoading}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        <FiXCircle className="w-4 h-4 mr-2 inline" />
                        Reject Item
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemModeration; 