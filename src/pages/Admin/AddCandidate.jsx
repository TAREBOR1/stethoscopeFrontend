import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Trash2, FileText } from 'react-feather';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { getElection } from '../../redux/admin/electionSlice';
import { getAllPosition } from '../../redux/admin/positionSlice';
import ImageUpload from '../../components/ui/ImageUpload';
import { AddCandidate, getCandidate } from '../../redux/admin/candidateSlice';

const CandidateRegistration = () => {
  const [candidates, setCandidates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [elections, setElections] = useState([]);
  const [positions, setPositions] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    manifesto: '',
    image: '',
    electionId: '',
    positionId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  const dispatch = useDispatch();
  const { candidateList } = useSelector((state) => state.candidate);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const electionRes = await dispatch(getElection());
        if (electionRes?.payload?.success) {
          setElections(electionRes?.payload?.elections || []);
        }
        const positionRes = await dispatch(getAllPosition());
        if (positionRes?.payload?.success) {
          setPositions(positionRes?.payload?.positions || []);
        }
        const candidateRes = await dispatch(getCandidate());
        if (candidateRes?.payload?.success) {
          setCandidates(candidateRes.payload?.candidates || []);
        }
      } catch (error) {
        console.error('Failed to fetch elections, positions, or candidates', error);
      }
    };
    fetchData();
  }, [dispatch]);

  const UploadImageToCloudinary = async () => {
    try {
      setImageLoadingState(true);
      const data = new FormData();
      data.append("my_file", imageFile);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/candidate/uploadImage`, data);
      if (response.data?.success) {
        setUploadedImageUrl(response.data?.result?.url);
        setFormData(prev => ({ ...prev, image: response.data?.result?.url }));
      }
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setImageLoadingState(false);
    }
  };

  useEffect(() => {
    if (imageFile !== null) {
      UploadImageToCloudinary();
    }
  }, [imageFile]);

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, electionId, positionId } = formData;
    if (!name || !electionId || !positionId) {
      setAlert({ type: 'error', message: 'All fields are required.' });
      setIsLoading(false);
      return;
    }

    try {
      const candidateRes = await dispatch(AddCandidate(formData));
      if (candidateRes?.payload?.success) {
        setCandidates(prev => [...prev, candidateRes.payload?.candidate]);
        setAlert({ type: 'success', message: candidateRes.payload?.message });
        setShowAddModal(false);
        setFormData({ name: '', manifesto: '', image: '', electionId: '', positionId: '' });
        setUploadedImageUrl('');
        setImageFile(null);
      } else {
        setAlert({ type: 'error', message: candidateRes.payload?.message || 'Failed to add candidate' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to register candidate.' });
    }

    setIsLoading(false);
    setTimeout(() => setAlert(null), 5000);
  };

  const handleDelete = (candidateId) => {
    setCandidates(prev => prev.filter(c => c._id !== candidateId));
    setAlert({ type: 'success', message: 'Candidate removed locally (implement backend delete).' });
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
          <h1 className="text-3xl font-bold text-gray-900">Candidate Registration</h1>
          <p className="mt-2 text-gray-600">
            Manage election candidates ({candidates.length} total)
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="mt-4 sm:mt-0">
          <Plus className="mr-2" size={18} /> Register Candidate
        </Button>
      </div>

      {alert && (
        <div className="mb-6">
          <Alert type={alert.type} message={alert.message} onDismiss={() => setAlert(null)} />
        </div>
      )}

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by candidate name..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manifesto</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates.length > 0 ? (
                filteredCandidates.map((candidate) => (
                  <tr key={candidate._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{candidate.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{candidate.manifesto || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDelete(candidate._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                    No candidates found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setFormData({ name: '', manifesto: '', image: '', electionId: '', positionId: '' });
          setUploadedImageUrl('');
          setImageFile(null);
        }}
        title="Register New Candidate"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="manifesto" className="block text-sm font-medium text-gray-700 mb-1">Manifesto</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                id="manifesto"
                name="manifesto"
                rows={3}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                placeholder="Candidate's manifesto"
                value={formData.manifesto}
                onChange={handleChange}
              />
            </div>
          </div>

          <ImageUpload imageFile={imageFile} setImageFile={setImageFile} uploadedImageUrl={uploadedImageUrl} isLoading={imageLoadingState} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Election *</label>
            <select
              name="electionId"
              value={formData.electionId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select election</option>
              {elections.map(e => (
                <option key={e._id} value={e._id}>{e.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
            <select
              name="positionId"
              value={formData.positionId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select position</option>
              {positions.map(p => (
                <option key={p._id} value={p._id}>{p.title}</option>
              ))}
            </select>
          </div>

          <div className="text-right">
            <Button type="submit" isLoading={isLoading} disabled={imageLoadingState}>
              {isLoading ? 'Registering...' : 'Register Candidate'}
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default CandidateRegistration;
