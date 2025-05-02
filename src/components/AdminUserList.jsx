// src/components/AdminUserList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api';
import { FaSpinner, FaUserShield, FaUser, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Modal from './Modal'; // Import the Modal component

function AdminUserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updatingUserId, setUpdatingUserId] = useState(null);

    // State for Edit Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentUserToEdit, setCurrentUserToEdit] = useState(null);
    const [editFormData, setEditFormData] = useState({ username: '', email: '', isAdmin: false });

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try { return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
        catch { return 'Invalid Date'; }
    };

    const fetchUsers = async () => {
        // setLoading(true); // Keep loading true only on initial load
        setError('');
        try {
            const response = await apiClient.get('/api/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            const errorMsg = error.response?.data?.message || "Could not load user list.";
            setError(errorMsg);
            // toast.error(errorMsg); // Avoid toast on initial load error?
        } finally {
            setLoading(false); // Set loading false after fetch attempt
        }
    };

    useEffect(() => {
        setLoading(true); // Set loading true when component mounts
        fetchUsers();
    }, []);

    // --- Edit Modal Functions ---
    const openEditModal = (user) => {
        setCurrentUserToEdit(user);
        setEditFormData({
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin
        });
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setCurrentUserToEdit(null);
    };

    const handleEditFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUserUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!currentUserToEdit) return;

        setUpdatingUserId(currentUserToEdit.id || currentUserToEdit._id); // Show loading indicator on the row
        closeEditModal(); // Close modal immediately

        try {
            // --- Backend Call (Combined Update) ---
            const userId = currentUserToEdit.id || currentUserToEdit._id;
            // Prepare only changed data if desired, or send all
            const updateData = {
                username: editFormData.username,
                email: editFormData.email,
                isAdmin: editFormData.isAdmin,
            };
            await apiClient.put(`/api/admin/users/${userId}`, updateData);
            toast.success(`User ${editFormData.username} updated successfully!`);
            fetchUsers(); // Re-fetch users to show updated data
            // --- End Backend Call ---
        } catch (error) {
            console.error("Error updating user:", error);
            toast.error(error.response?.data?.message || "Failed to update user.");
        } finally {
             setUpdatingUserId(null); // Stop loading indicator
        }
    };
    // --- End Edit Modal Functions ---

    // --- Delete Handler ---
    const handleDeleteUser = async (userId, username) => {
         if (window.confirm(`Are you sure you want to DELETE user "${username}" (${userId.substring(0,8)}...)? This action cannot be undone.`)) {
             setUpdatingUserId(userId);
             try {
                 await apiClient.delete(`/api/admin/users/${userId}`);
                 toast.success(`User ${username} deleted successfully!`);
                 fetchUsers();
             } catch (error) {
                 console.error("Error deleting user:", error);
                 toast.error(error.response?.data?.message || "Failed to delete user.");
             } finally {
                 setUpdatingUserId(null);
             }
         }
    };
    // --- End Delete Handler ---

    if (loading) {
        return ( <div className="flex justify-center items-center min-h-[calc(100vh-200px)] text-gray-600"><FaSpinner className="animate-spin text-2xl mr-3" /> Loading Users...</div> );
    }

    return (
        <div className="p-6 md:p-8">
            {/* Back Button */}
            <Link to="/admin" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 group">
                <FaArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                Back to Admin Dashboard
            </Link>

            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Manage Users ({users.length})</h2>

             {error && ( <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert"><strong className="font-bold">Error: </strong><span className="block sm:inline">{error}</span></div> )}

            <div className="bg-white shadow-md rounded-lg overflow-x-auto border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {/* Headers */}
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.length === 0 && !loading && !error ? (
                            <tr><td colSpan="5" className="text-center py-10 text-gray-500">No users found.</td></tr>
                        ) : (
                            users.map(user => {
                                const currentUserId = user.id || user._id;
                                const isBeingUpdated = updatingUserId === currentUserId;
                                return (
                                    <tr key={currentUserId} className={`hover:bg-gray-50 transition-colors duration-150 ${isBeingUpdated ? 'opacity-50' : ''}`}>
                                        {/* User Data Cells */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {user.isAdmin ? ( <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300"><FaUserShield className="mr-1" /> Admin</span> )
                                            : ( <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300"><FaUser className="mr-1" /> User</span> )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.created_at)}</td>
                                        {/* Action Buttons Cell */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                            {isBeingUpdated ? ( <FaSpinner className="animate-spin inline-block text-gray-500" /> )
                                            : (
                                                <>
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="text-indigo-600 hover:text-indigo-900 font-medium px-2 py-1 rounded hover:bg-indigo-50 text-xs"
                                                        title="Update User"
                                                        disabled={updatingUserId !== null}
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUser(currentUserId, user.username)}
                                                        className="text-red-600 hover:text-red-900 font-medium px-2 py-1 rounded hover:bg-red-50 text-xs"
                                                        title="Delete User"
                                                        disabled={updatingUserId !== null}
                                                    >
                                                        Delete
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

            {/* Edit User Modal */}
            <Modal title="Edit User Details" isOpen={isEditModalOpen} onClose={closeEditModal} size="lg">
                 {currentUserToEdit && (
                     <form onSubmit={handleUserUpdateSubmit} className="space-y-4">
                         <div>
                             <label htmlFor="edit-username" className="block text-sm font-medium text-gray-700">Username</label>
                             <input
                                 type="text"
                                 id="edit-username"
                                 name="username"
                                 value={editFormData.username}
                                 onChange={handleEditFormChange}
                                 required
                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                             />
                         </div>
                         <div>
                             <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">Email</label>
                             <input
                                 type="email"
                                 id="edit-email"
                                 name="email"
                                 value={editFormData.email}
                                 onChange={handleEditFormChange}
                                 required
                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                             />
                         </div>
                         <div className="flex items-center">
                             <input
                                 id="edit-isAdmin"
                                 name="isAdmin"
                                 type="checkbox"
                                 checked={editFormData.isAdmin}
                                 onChange={handleEditFormChange}
                                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                             />
                             <label htmlFor="edit-isAdmin" className="ml-2 block text-sm text-gray-900">
                                 Assign Admin Role
                             </label>
                         </div>
                         <div className="pt-4 flex justify-end space-x-3">
                             <button
                                 type="button"
                                 onClick={closeEditModal}
                                 className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                             >
                                 Cancel
                             </button>
                             <button
                                 type="submit"
                                 className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                             >
                                 Save Changes
                             </button>
                         </div>
                     </form>
                 )}
            </Modal>
        </div>
    );
}

export default AdminUserList;