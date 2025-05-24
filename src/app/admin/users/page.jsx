"use client";

import { useState, useEffect } from "react";
import { FaUsers, FaSearch, FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    role: "customer",
    password: "",
    phone: ""
  });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users);
      setError(null);
    } catch (err) {
      setError('Error loading users: ' + err.message);
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return format(date, "d MMM yyyy", { locale: id });
    } catch (err) {
      console.error("Date formatting error:", err);
      return dateString;
    }
  };

  // Handle delete user
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/users/${userToDelete._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Refresh users list
      fetchUsers();
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Error deleting user: ' + err.message);
    }
  };

  // Handle add/edit user
  const handleAddClick = () => {
    setIsEditing(false);
    setEditUser({
      name: "",
      email: "",
      role: "customer",
      password: "",
      phone: ""
    });
    setShowAddEditModal(true);
  };

  const handleEditClick = (user) => {
    setIsEditing(true);
    setEditUser({
      _id: user._id,
      name: user.name || "",
      email: user.email || "",
      role: user.role || "customer",
      phone: user.phone || "",
      // Password is empty when editing an existing user
      password: ""
    });
    setShowAddEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let userData = { ...editUser };
      
      // If password is empty and we're editing, remove it from the request
      if (isEditing && !userData.password) {
        delete userData.password;
      }

      const url = isEditing 
        ? `/api/users/${userData._id}` 
        : '/api/users';
        
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Operation failed');
      }

      // Refresh users list
      fetchUsers();
      setShowAddEditModal(false);
    } catch (err) {
      console.error('Error saving user:', err);
      setError('Error saving user: ' + err.message);
    }
  };

  if (isLoading) return (
    <div className="p-6 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#50806B]"></div>
    </div>
  );

  return (
    <div className="p-1">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Kelola Pengguna</h1>
        <p className="text-gray-600 mt-1">Kelola dan atur semua pengguna di Green Garden</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Actions Row */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Cari pengguna..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#50806B] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Add User Button */}
        <button
          onClick={handleAddClick}
          className="flex items-center justify-center px-4 py-2 bg-[#50806B] text-white rounded-lg hover:bg-[#3d6854] transition-colors duration-300"
        >
          <FaUserPlus className="mr-2" />
          Tambah Pengguna
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telepon
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peran
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Bergabung
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#50806B]/20 flex items-center justify-center text-[#50806B]">
                        <FaUsers />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">{user.phone || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {user.role === "admin" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                          Admin
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Customer
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    Tidak ada pengguna yang ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Previous
              </button>
              <button
                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredUsers.length)}</span> of{' '}
                  <span className="font-medium">{filteredUsers.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`relative inline-flex items-center px-4 py-2 border ${currentPage === number ? 'bg-[#50806B] text-white border-[#50806B]' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'} text-sm font-medium`}
                    >
                      {number}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    &gt;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaTrash className="text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Hapus Pengguna</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Apakah Anda yakin ingin menghapus pengguna {userToDelete?.name}? Tindakan ini tidak dapat dibatalkan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Hapus
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit User Modal */}
      {showAddEditModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                  <div className="mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {isEditing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={editUser.name}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-[#50806B] focus:border-[#50806B] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={editUser.email}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-[#50806B] focus:border-[#50806B] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telepon</label>
                      <input
                        type="text"
                        name="phone"
                        id="phone"
                        value={editUser.phone || ''}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-[#50806B] focus:border-[#50806B] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        {isEditing ? 'Password (kosongkan jika tidak diubah)' : 'Password'}
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        required={!isEditing}
                        value={editUser.password}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-[#50806B] focus:border-[#50806B] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">Peran</label>
                      <select
                        name="role"
                        id="role"
                        value={editUser.role}
                        onChange={handleInputChange}
                        className="mt-1 focus:ring-[#50806B] focus:border-[#50806B] block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#50806B] text-base font-medium text-white hover:bg-[#3d6854] focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {isEditing ? 'Simpan Perubahan' : 'Tambah Pengguna'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                    onClick={() => setShowAddEditModal(false)}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}