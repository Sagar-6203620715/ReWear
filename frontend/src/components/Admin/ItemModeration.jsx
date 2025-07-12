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
  FiPackage,
  FiArrowRight,
  FiAlertCircle
} from 'react-icons/fi';
import axios from 'axios';

const ItemModeration = () => {
  const [allItems, setAllItems] = useState([]); // Store all items for accurate counts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected, flagged, all
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [swapData, setSwapData] = useState({}); // Store swap data for items
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/items`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setAllItems(response.data.items);
      
      // Try to fetch swap data, but don't fail if it doesn't work
      try {
        await fetchSwapData(response.data.items);
      } catch (swapError) {
        console.error('Failed to fetch swap data:', swapError);
        // Continue without swap data
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const fetchSwapData = async (items) => {
    try {
      const token = localStorage.getItem('userToken');
      
      // Get all swaps (not just pending) so we can show swap items in all tabs
      const swapResponse = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/swaps`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const swaps = swapResponse.data.swaps;
      const swapDataMap = {};
      
      // Create a map of item IDs to their associated swaps
      items.forEach(item => {
        const itemSwap = swaps.find(swap => 
          swap.initiatorItem._id === item._id || swap.recipientItem._id === item._id
        );
        
        if (itemSwap) {
          swapDataMap[item._id] = itemSwap;
        }
      });
      
      setSwapData(swapDataMap);
    } catch (err) {
      console.error('Error fetching swap data:', err);
      // Don't throw error, just log it so the component can still function
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
      
      // Immediately update local state for better UX
      setAllItems(prevItems => 
        prevItems.map(item => 
          item._id === itemId 
            ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' }
            : item
        )
      );
      
      setShowModal(false);
      setSelectedItem(null);
      setRejectionReason('');
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || `Failed to ${action} item`);
      // If action failed, refresh all items to ensure consistency
      await fetchAllItems();
    } finally {
      setActionLoading(false);
    }
  };

  const handleSwapAction = async (swapId, action, reason = '') => {
    setActionLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/swaps/${swapId}/${action}`,
        { reason },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Refresh all data to get updated item statuses
      await fetchAllItems();
      
      setShowModal(false);
      setSelectedItem(null);
      setRejectionReason('');
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || `Failed to ${action} swap`);
      // If action failed, refresh all items to ensure consistency
      await fetchAllItems();
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'listed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'flagged': return 'bg-orange-100 text-orange-800';
      case 'pending_swap': return 'bg-purple-100 text-purple-800';
      case 'swapped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="w-4 h-4" />;
      case 'listed': return <FiCheckCircle className="w-4 h-4" />;
      case 'rejected': return <FiXCircle className="w-4 h-4" />;
      case 'flagged': return <FiFlag className="w-4 h-4" />;
      case 'pending_swap': return <FiPackage className="w-4 h-4" />;
      case 'swapped': return <FiCheckCircle className="w-4 h-4" />;
      default: return <FiClock className="w-4 h-4" />;
    }
  };

  // Create a function to group items by swaps
  const getGroupedItems = () => {
    const grouped = [];
    const processedItems = new Set();
    
    allItems.forEach(item => {
      if (processedItems.has(item._id)) return;
      
      const swap = swapData[item._id];
      if (swap) {
        // This is a swap item - find both items and group them
        const initiatorItem = allItems.find(i => i._id === swap.initiatorItem._id);
        const recipientItem = allItems.find(i => i._id === swap.recipientItem._id);
        
        if (initiatorItem && recipientItem) {
          grouped.push({
            type: 'swap',
            swap: swap,
            items: [initiatorItem, recipientItem]
          });
          processedItems.add(initiatorItem._id);
          processedItems.add(recipientItem._id);
        }
      } else {
        // Check if this item is part of any swap (even if not the primary item)
        const isPartOfSwap = Object.values(swapData).some(swap => 
          swap.initiatorItem._id === item._id || swap.recipientItem._id === item._id
        );
        
        if (!isPartOfSwap) {
          // Regular item (not part of any swap)
          grouped.push({
            type: 'item',
            item: item
          });
          processedItems.add(item._id);
        }
      }
    });
    
    return grouped;
  };

  const groupedItems = getGroupedItems();
  const filteredGroups = groupedItems.filter(group => {
    if (group.type === 'swap') {
      // For swaps, check if any item matches the filter
      if (filter === 'all') {
        // In "all" tab, show everything EXCEPT swapped items
        return !group.items.some(item => item.status === 'swapped');
      } else if (filter === 'swapped') {
        // In "swapped" tab, show only swapped items
        return group.items.some(item => item.status === 'swapped');
      } else {
        return group.items.some(item => item.status === filter);
      }
    } else {
      // For regular items
      if (filter === 'all') {
        // In "all" tab, show everything EXCEPT swapped items
        return group.item.status !== 'swapped';
      } else if (filter === 'swapped') {
        // In "swapped" tab, show only swapped items
        return group.item.status === 'swapped';
      } else {
        return group.item.status === filter;
      }
    }
  });

  const handleRejectWithReason = (itemId) => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    handleAction(itemId, 'reject', rejectionReason);
  };

  const handleRejectSwapWithReason = (swapId) => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    handleSwapAction(swapId, 'reject', rejectionReason);
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

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <FiAlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => setError('')}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <FiXCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {[
                { id: 'all', label: 'Active Items', count: allItems.filter(i => i.status !== 'swapped').length },
                { id: 'pending', label: 'Pending Review', count: allItems.filter(i => i.status === 'pending').length },
                { id: 'flagged', label: 'Flagged Items', count: allItems.filter(i => i.status === 'flagged').length },
                { id: 'approved', label: 'Approved', count: allItems.filter(i => i.status === 'approved').length },
                { id: 'rejected', label: 'Rejected', count: allItems.filter(i => i.status === 'rejected').length },
                { id: 'swapped', label: 'Swapped', count: allItems.filter(i => i.status === 'swapped').length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
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
          {filteredGroups.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500">No items match the current filter criteria.</p>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.type === 'swap' ? group.swap._id : group.item._id} className="bg-white rounded-lg shadow-sm p-6">
                {group.type === 'swap' ? (
                  <div>
                    {/* Swap Header */}
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-blue-900">Swap Request</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(group.swap.status)}`}>
                          {getStatusIcon(group.swap.status)}
                          <span>{group.swap.status}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-blue-700">
                        <div className="flex items-center">
                          <FiUser className="w-4 h-4 mr-1" />
                          <span>{group.swap.initiator.name} → {group.swap.recipient.name}</span>
                        </div>
                        <div className="flex items-center">
                          <FiCalendar className="w-4 h-4 mr-1" />
                          {new Date(group.swap.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Items Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Initiator Item */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <img 
                            src={group.items[0].images && group.items[0].images.length > 0 ? group.items[0].images[0] : 'https://via.placeholder.com/150x150?text=No+Image'} 
                            alt={group.items[0].name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{group.items[0].name}</h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{group.items[0].description}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500">Category:</span>
                                <p className="font-medium">{group.items[0].category}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Size:</span>
                                <p className="font-medium">{group.items[0].size}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Condition:</span>
                                <p className="font-medium">{group.items[0].condition}</p>
                              </div>
                            </div>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <FiUser className="w-3 h-3 mr-1" />
                              {group.items[0].user?.name || 'Unknown User'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Recipient Item */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <img 
                            src={group.items[1].images && group.items[1].images.length > 0 ? group.items[1].images[0] : 'https://via.placeholder.com/150x150?text=No+Image'} 
                            alt={group.items[1].name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{group.items[1].name}</h3>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{group.items[1].description}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-gray-500">Category:</span>
                                <p className="font-medium">{group.items[1].category}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Size:</span>
                                <p className="font-medium">{group.items[1].size}</p>
                              </div>
                              <div>
                                <span className="text-gray-500">Condition:</span>
                                <p className="font-medium">{group.items[1].condition}</p>
                              </div>
                            </div>
                            <div className="flex items-center mt-2 text-xs text-gray-500">
                              <FiUser className="w-3 h-3 mr-1" />
                              {group.items[1].user?.name || 'Unknown User'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Swap Action Buttons */}
                    {group.swap.status === 'pending' && (
                      <div className="flex justify-end space-x-3 mt-4 pt-4 border-t">
                        <button
                          onClick={() => {
                            setSelectedItem(group.items[0]);
                            setShowModal(true);
                          }}
                          className="flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <FiEye className="w-4 h-4 mr-1" />
                          View Details
                        </button>
                        <button
                          onClick={() => handleSwapAction(group.swap._id, 'approve')}
                          disabled={actionLoading}
                          className="flex items-center justify-center px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <FiCheckCircle className="w-4 h-4 mr-1" />
                          Approve Swap
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem({ ...group.items[0], isSwap: true, swapId: group.swap._id });
                            setShowModal(true);
                          }}
                          disabled={actionLoading}
                          className="flex items-center justify-center px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          <FiXCircle className="w-4 h-4 mr-1" />
                          Reject Swap
                        </button>
                      </div>
                    )}
                    
                    {/* View Details button for non-pending swaps */}
                    {group.swap.status !== 'pending' && (
                      <div className="flex justify-end mt-4 pt-4 border-t">
                        <button
                          onClick={() => {
                            setSelectedItem(group.items[0]);
                            setShowModal(true);
                          }}
                          className="flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <FiEye className="w-4 h-4 mr-1" />
                          View Details
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-start space-x-4">
                    {/* Item Image */}
                    <img 
                      src={group.item.images && group.item.images.length > 0 ? group.item.images[0] : 'https://via.placeholder.com/150x150?text=No+Image'} 
                      alt={group.item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    
                    {/* Item Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{group.item.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(group.item.status)}`}>
                          {getStatusIcon(group.item.status)}
                          <span>{group.item.status}</span>
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{group.item.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <p className="font-medium">{group.item.category}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <p className="font-medium">{group.item.size}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Condition:</span>
                          <p className="font-medium">{group.item.condition}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiUser className="w-4 h-4 mr-1" />
                          {group.item.user?.name || 'Unknown User'}
                        </div>
                        <div className="flex items-center">
                          <FiCalendar className="w-4 h-4 mr-1" />
                          {new Date(group.item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => {
                          setSelectedItem(group.item);
                          setShowModal(true);
                        }}
                        className="flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        <FiEye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                      
                      {group.item.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAction(group.item._id, 'approve')}
                            disabled={actionLoading}
                            className="flex items-center justify-center px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors disabled:opacity-50"
                          >
                            <FiCheckCircle className="w-4 h-4 mr-1" />
                            Approve Item
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItem(group.item);
                              setShowModal(true);
                            }}
                            disabled={actionLoading}
                            className="flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            <FiXCircle className="w-4 h-4 mr-1" />
                            Reject Item
                          </button>
                        </>
                      )}
                      
                      {group.item.status === 'flagged' && (
                        <>
                          <button
                            onClick={() => handleAction(group.item._id, 'approve')}
                            disabled={actionLoading}
                            className="flex items-center justify-center px-3 py-2 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors disabled:opacity-50"
                          >
                            <FiCheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              setSelectedItem({ ...group.item, isFlagged: true });
                              setShowModal(true);
                            }}
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
                )}
              </div>
            ))
          )}
        </div>

        {/* Item Detail Modal */}
        {showModal && selectedItem && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
                setRejectionReason('');
              }
            }}
          >
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Item Details</h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setRejectionReason('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiXCircle className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <img 
                    src={selectedItem.images && selectedItem.images.length > 0 ? selectedItem.images[0] : 'https://via.placeholder.com/400x300?text=No+Image'} 
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
                        <span className="text-gray-500">Brand:</span>
                        <p className="font-medium">{selectedItem.brand || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Material:</span>
                        <p className="font-medium">{selectedItem.material || 'Not specified'}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Status:</span>
                        <p className="font-medium">{selectedItem.status}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">User:</span>
                        <p className="font-medium">{selectedItem.user?.name || 'Unknown User'}</p>
                      </div>
                    </div>
                  </div>
                  
                  {(selectedItem.status === 'pending' || selectedItem.isFlagged) && (
                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rejection Reason (optional)
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Provide a reason for rejection..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          rows="3"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => selectedItem.isSwap ? handleSwapAction(selectedItem.swapId, 'approve') : handleAction(selectedItem._id, 'approve')}
                          disabled={actionLoading}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <FiCheckCircle className="w-4 h-4 mr-2 inline" />
                          {selectedItem.isSwap ? 'Approve Swap' : 'Approve Item'}
                        </button>
                        <button
                          onClick={() => selectedItem.isSwap ? handleRejectSwapWithReason(selectedItem.swapId) : handleRejectWithReason(selectedItem._id)}
                          disabled={actionLoading}
                          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          <FiXCircle className="w-4 h-4 mr-2 inline" />
                          {selectedItem.isSwap ? 'Reject Swap' : (selectedItem.isFlagged ? 'Remove Item' : 'Reject Item')}
                        </button>
                      </div>
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