// src/components/AdminOrderList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api';
import { FaSpinner, FaTruck, FaArrowLeft, FaUser, FaMapMarkerAlt, FaShoppingBag, FaCalendarAlt, FaClock } from 'react-icons/fa'; // Added more icons
import { toast } from 'react-toastify';
import Modal from './Modal'; // Import the Modal component

// Define allowed statuses (should match backend)
const ALLOWED_ORDER_STATUSES = ['processing', 'pending', 'shipped', 'delivered', 'completed', 'cancelled', 'failed'];


function AdminOrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingOrderId, setUpdatingOrderId] = useState(null);

    // State for View Modal
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [currentOrderToView, setCurrentOrderToView] = useState(null);
    const [viewModalLoading, setViewModalLoading] = useState(false);

    // --- Helper to format currency ---
    const formatCurrency = (amount) => { /* ... (same as before) ... */ };
    // --- Helper to format date & time ---
    const formatDateTime = (dateString) => { /* ... (same as before) ... */ };
     // --- Helper function to format date only ---
    const formatDateOnly = (dateString) => {
        if (!dateString) return null;
        try { return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
        catch { return 'Invalid Date'; }
    };
    // --- Helper function to get status styles ---
    const getStatusClass = (status) => { /* ... (same as before) ... */ };


    const fetchOrders = async () => {
        // setLoading(true); // Keep loading only for initial
        setError('');
        try {
            const response = await apiClient.get('/api/admin/orders');
            setOrders(response.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
            const errorMsg = error.response?.data?.message || "Could not load order list.";
            setError(errorMsg);
            // toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchOrders();
    }, []);

     // --- View Modal Functions ---
     const openViewModal = async (orderId) => {
        setIsViewModalOpen(true);
        setViewModalLoading(true);
        setCurrentOrderToView(null); // Clear previous order
        try {
            // Fetch full details for the specific order
            const res = await apiClient.get(`/api/admin/orders/${orderId}`);
            setCurrentOrderToView(res.data);
        } catch (err) {
            console.error("Error fetching order details:", err);
            toast.error("Could not load order details.");
            closeViewModal(); // Close modal on error
        } finally {
            setViewModalLoading(false);
        }
     };

     const closeViewModal = () => {
         setIsViewModalOpen(false);
         setCurrentOrderToView(null);
     };
     // --- End View Modal Functions ---


     // --- Update Status Handler ---
     const handleUpdateStatus = async (orderId, currentStatus) => {
          const newStatus = prompt(`Update status for order ${orderId.substring(0,8)}...\nCurrent: ${currentStatus}\nEnter new status (e.g., ${ALLOWED_ORDER_STATUSES.join(', ')}):`);
          if (newStatus && newStatus.trim() !== '') {
              const statusToUpdate = newStatus.trim().toLowerCase();
              if (!ALLOWED_ORDER_STATUSES.includes(statusToUpdate)) {
                  toast.error(`Invalid status: "${newStatus}". Please use one of the allowed statuses.`);
                  return;
              }
              setUpdatingOrderId(orderId);
              try {
                  await apiClient.put(`/api/admin/orders/${orderId}/status`, { status: statusToUpdate });
                  toast.success(`Order status updated to ${statusToUpdate}!`);
                  fetchOrders();
              } catch (error) {
                  console.error("Error updating order status:", error);
                  toast.error(error.response?.data?.message || "Failed to update order status.");
              } finally {
                   setUpdatingOrderId(null);
              }
          }
     };
     // --- End Update Status Handler ---


     if (loading) {
        return ( <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-gray-600"><FaSpinner className="animate-spin text-2xl mr-3" /> Loading Orders...</div> );
    }

    return (
        <div className="p-6 md:p-8">
             {/* Back Button */}
             <Link to="/admin" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 group">
                <FaArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                Back to Admin Dashboard
            </Link>

            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Manage Orders ({orders.length})</h2>

             {error && ( <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div> )}

             <div className="bg-white shadow-md rounded-lg overflow-x-auto border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* Headers */}
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.length === 0 && !loading && !error ? (
                            <tr><td colSpan="7" className="text-center py-10 text-gray-500">No orders found.</td></tr>
                        ) : (
                            orders.map(order => {
                                const isBeingUpdated = updatingOrderId === order.id;
                                return (
                                    <tr key={order.id} className={`hover:bg-gray-50 transition-colors duration-150 ${isBeingUpdated ? 'opacity-50' : ''}`}>
                                        {/* Order Data Cells */}
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-gray-600" title={order.id}>{order.id.substring(0, 8)}...</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(order.orderDate)}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <div>{order.user?.username || <span className='text-red-500 italic'>N/A</span>}</div>
                                            <div className="text-xs text-gray-500">{order.user?.email || ''}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{formatCurrency(order.totalAmount)}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusClass(order.paymentStatus)}`}>{order.paymentStatus || 'Unknown'}</span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500"> {order.items?.length || 0} item(s)</td>
                                        {/* Action Buttons Cell */}
                                        <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                            {isBeingUpdated ? ( <FaSpinner className="animate-spin inline-block text-gray-500" /> )
                                            : (
                                                <>
                                                    <button
                                                        onClick={() => openViewModal(order.id)}
                                                        className="text-blue-600 hover:text-blue-900 font-medium px-2 py-1 rounded hover:bg-blue-50 text-xs"
                                                        title="View Order Details"
                                                        disabled={updatingOrderId !== null}
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, order.paymentStatus)}
                                                        className="text-green-600 hover:text-green-900 font-medium px-2 py-1 rounded hover:bg-green-50 text-xs"
                                                        title="Update Order Status"
                                                        disabled={updatingOrderId !== null}
                                                    >
                                                        Update Status
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Order Modal */}
            <Modal title="Order Details" isOpen={isViewModalOpen} onClose={closeViewModal} size="xl">
                 {viewModalLoading ? (
                      <div className="flex justify-center items-center p-10"><FaSpinner className="animate-spin text-2xl text-gray-500" /></div>
                 ) : !currentOrderToView ? (
                      <p className="text-red-500 p-6 text-center">Could not load order details.</p>
                 ) : (
                     <div className="space-y-6">
                         {/* Order Summary Section */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                             <div><strong className="text-gray-600 font-medium">Order ID:</strong> <span className="font-mono text-gray-800">{currentOrderToView.id}</span></div>
                             <div><strong className="text-gray-600 font-medium">Order Date:</strong> <span className="text-gray-800">{formatDateTime(currentOrderToView.orderDate)}</span></div>
                             <div><strong className="text-gray-600 font-medium">Total Amount:</strong> <span className="text-green-700 font-bold">{formatCurrency(currentOrderToView.totalAmount)}</span></div>
                             <div><strong className="text-gray-600 font-medium">Payment Method:</strong> <span className="text-gray-800 capitalize">{currentOrderToView.paymentMethod === 'cod' ? 'Cash on Delivery' : currentOrderToView.paymentMethod}</span></div>
                             <div><strong className="text-gray-600 font-medium">Status:</strong> <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${getStatusClass(currentOrderToView.paymentStatus)}`}>{currentOrderToView.paymentStatus || 'Unknown'}</span></div>
                             {currentOrderToView.estimatedDeliveryDate && (
                                <div><strong className="text-gray-600 font-medium">Est. Delivery:</strong> <span className="text-green-700">{formatDateOnly(currentOrderToView.estimatedDeliveryDate)}</span></div>
                             )}
                         </div>

                         {/* Customer & Shipping Section */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t">
                             <div>
                                 <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><FaUser className="mr-2 text-gray-400"/>Customer Details</h4>
                                 <p className="text-sm text-gray-600"><strong>Username:</strong> {currentOrderToView.user?.username || 'N/A'}</p>
                                 <p className="text-sm text-gray-600"><strong>Email:</strong> {currentOrderToView.user?.email || 'N/A'}</p>
                             </div>
                             <div>
                                 <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><FaMapMarkerAlt className="mr-2 text-gray-400"/>Shipping Address</h4>
                                 {currentOrderToView.shippingAddress ? (
                                     <div className="text-sm text-gray-600 leading-relaxed space-y-0.5">
                                         {currentOrderToView.shippingAddress.line1 && <div>{currentOrderToView.shippingAddress.line1}</div>}
                                         {currentOrderToView.shippingAddress.line2 && <div>{currentOrderToView.shippingAddress.line2}</div>}
                                         <div>
                                             {currentOrderToView.shippingAddress.city && <span>{currentOrderToView.shippingAddress.city}, </span>}
                                             {currentOrderToView.shippingAddress.state && <span>{currentOrderToView.shippingAddress.state}</span>}
                                             {currentOrderToView.shippingAddress.postalCode && <span> - {currentOrderToView.shippingAddress.postalCode}</span>}
                                         </div>
                                         {currentOrderToView.shippingAddress.country && <div>{currentOrderToView.shippingAddress.country}</div>}
                                         {currentOrderToView.shippingAddress.phone && <div className="mt-1">Phone: {currentOrderToView.shippingAddress.phone}</div>}
                                     </div>
                                 ) : <p className="text-sm text-gray-500 italic">No address provided.</p>}
                             </div>
                         </div>

                         {/* Items Section */}
                         <div className="pt-4 border-t">
                             <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><FaShoppingBag className="mr-2 text-gray-400"/>Ordered Items</h4>
                             <ul className="space-y-2">
                                 {currentOrderToView.items?.length > 0 ? (
                                     currentOrderToView.items.map((item, index) => (
                                         <li key={index} className="text-sm flex justify-between items-center border-b border-gray-100 pb-1 last:border-b-0">
                                             <span>{item.productName || 'Unknown Item'} ({item.quantity} x {formatCurrency(item.price)})</span>
                                             <span className="font-medium">{formatCurrency(item.quantity * item.price)}</span>
                                         </li>
                                     ))
                                 ) : (
                                     <li className="text-sm text-gray-500 italic">No items found in this order.</li>
                                 )}
                             </ul>
                         </div>

                          <div className="pt-4 flex justify-end">
                             <button
                                 type="button"
                                 onClick={closeViewModal}
                                 className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                             >
                                 Close
                             </button>
                         </div>
                     </div>
                 )}
            </Modal>
        </div>
    );
}

export default AdminOrderList;