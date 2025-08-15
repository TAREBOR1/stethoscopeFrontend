import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Trash2 } from 'react-feather';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/authSlice';
import { getAllUser } from '../../redux/userSlice';

const UserManagement = () => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMatno, setNewMatno] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState(null);

  const { userList } = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    dispatch(getAllUser());
  }, [dispatch]);

  useEffect(() => {
    setUsers(userList?.users);
  }, [userList]);

  const filteredUsers = users.filter(user =>
    user.matricNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = async (e) => {
    e.preventDefault();

    const matnoRegex = /^[A-Za-z]{3}\d{7}$/; // e.g., MED1907564
    if (!matnoRegex.test(newMatno)) {
      setAlert({
        type: 'error',
        message: 'Invalid format. Matric number should be like MED1907564'
      });
      return;
    }

    if (!email || !email.includes('@')) {
      setAlert({
        type: 'error',
        message: 'Please enter a valid email address.'
      });
      return;
    }

    try {
      const resultAction = await dispatch(registerUser({
        fullName,
        matricNumber: newMatno,
        email
      }));

      const response = resultAction?.payload;

      if (response?.success) {
        setAlert({
          type: 'success',
          message: `User ${newMatno} registered successfully.`
        });
        setShowAddModal(false);
        setNewMatno('');
        setFullName('');
        setEmail('');
        dispatch(getAllUser());
      } else {
        setAlert({
          type: 'error',
          message: response.message || 'Something went wrong'
        });
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Network error or server issue.'
      });
    }

    setTimeout(() => setAlert(null), 5000);
  };

  const handleDelete = (userId) => {
    const userToDelete = users.find(user => user._id === userId);
    if (userToDelete?.matricNumber === 'ADMIN001') {
      setAlert({ type: 'error', message: 'Cannot delete admin user' });
      return;
    }

    setAlert({
      type: 'success',
      message: `User ${userToDelete.matricNumber} removed (fake delete for now)`
    });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-gray-600">
            Manage voter accounts ({users.length} total users)
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="mt-4 sm:mt-0">
          <Plus className="mr-2" size={18} />
          Add Voter
        </Button>
      </div>

      {alert && (
        <div className="mb-6">
          <Alert
            type={alert.type}
            message={alert.message}
            onDismiss={() => setAlert(null)}
          />
        </div>
      )}

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name, email, or matric number..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matric Number</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.matricNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className={`text-red-600 hover:text-red-900 ${user.matricNumber === 'ADMIN001' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={user.matricNumber === 'ADMIN001'}
                        title={user.matricNumber === 'ADMIN001' ? 'Cannot delete admin' : 'Delete user'}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found matching your search
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setNewMatno('');
          setFullName('');
          setEmail('');
        }}
        title="Add New Voter"
      >
        <form onSubmit={handleAddUser}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g. John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g. student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="matno" className="block text-sm font-medium text-gray-700 mb-1">
              Matric Number *
            </label>
            <input
              type="text"
              id="matno"
              name="matno"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g. MED1907564"
              value={newMatno}
              onChange={(e) => setNewMatno(e.target.value)}
              required
              title="Format: 3 letters followed by 7 digits"
            />
            <p className="mt-2 text-xs text-gray-500">
              Format: 3 letters followed by 7 digits (e.g. MED1907564)
            </p>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setNewMatno('');
                setFullName('');
                setEmail('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Add Voter</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default UserManagement;
