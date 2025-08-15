import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock } from 'react-feather';
import { useDispatch, useSelector } from 'react-redux';
import   { AddElection }  from '../../redux/admin/electionSlice';
import  { AddPosition }  from '../../redux/admin/positionSlice';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const CreateElection = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.election);

  const [election, setElection] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  const [positionInput, setPositionInput] = useState('');
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [createdElectionId, setCreatedElectionId] = useState(null);
  const [alert, setAlert] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setElection(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, startDate, endDate } = election;
    if (!title || !startDate || !endDate) {
      setAlert({ type: 'error', message: 'Title, start date and end date are required.' });
      return;
    }

    try {
      const res = await dispatch(AddElection(election));
      if (res?.payload?.success) {
        toast.success(res.payload.message);
        setCreatedElectionId(res.payload.election._id);
        setElection({ title: '', description: '', startDate: '', endDate: '' });
      } else {
        toast.error(res.payload?.message || 'Failed to create election');
      }
    } catch (err) {
      toast.error('Unexpected error');
    }
  };

  const handleAddPosition = async () => {
    if (!positionInput || !createdElectionId) return;

    try {
      const res = await dispatch(AddPosition({
        title: positionInput,
        electionId: createdElectionId
      }));
      if (res?.payload?.success) {
        toast.success('Position added');
        setPositionInput('');
        setShowPositionModal(false);
      } else {
        toast.error(res.payload?.message || 'Failed to add position');
      }
    } catch (err) {
      toast.error('Unexpected error while adding position');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Election</h1>

      {alert && (
        <Alert type={alert.type} message={alert.message} dismissible />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                name="title"
                value={election.title}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                name="description"
                rows={3}
                value={election.description}
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Start Date</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={election.startDate}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">End Date</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={election.endDate}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>

            <div className="text-right">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Election'}
              </Button>
            </div>

            {createdElectionId && (
              <div className="text-right mt-4">
                <Button type="button" onClick={() => setShowPositionModal(true)}>
                  Add Position
                </Button>
              </div>
            )}
          </div>
        </div>
      </form>

      <Modal
        isOpen={showPositionModal}
        onClose={() => setShowPositionModal(false)}
        title="Add Position"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Position Title</label>
            <input
              value={positionInput}
              onChange={(e) => setPositionInput(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. President"
            />
          </div>

          <div className="text-right">
            <Button onClick={handleAddPosition}>Save Position</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default CreateElection;
