import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import CandidateModal from '../../components/Candidates/CandidateModal';

// Dummy election data
const dummyElections = [
  {
    id: '1',
    title: 'Student Council Election 2023',
    description: 'Annual election for the student council representatives',
    status: 'active',
    startDate: '2023-05-01T00:00:00Z',
    endDate: '2023-05-30T23:59:59Z',
    hasVoted: false,
    candidates: [
      {
        id: '101',
        name: 'Alex Johnson',
        position: 'President',
        description: 'Focused on improving student facilities and campus life',
        image: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      {
        id: '102',
        name: 'Sarah Williams',
        position: 'President',
        description: 'Advocating for better mental health resources',
        image: 'https://randomuser.me/api/portraits/women/44.jpg'
      },
      {
        id: '103',
        name: 'Michael Chen',
        position: 'Vice President',
        description: 'Working on academic support programs',
        image: 'https://randomuser.me/api/portraits/men/22.jpg'
      }
    ]
  },
  {
    id: '2',
    title: 'Class Representative Election',
    description: 'Election for class representatives',
    status: 'completed',
    startDate: '2023-04-01T00:00:00Z',
    endDate: '2023-04-15T23:59:59Z',
    hasVoted: true,
    candidates: [
      {
        id: '201',
        name: 'Emma Davis',
        position: 'Class Rep',
        description: 'Focusing on improving class communication',
        image: 'https://randomuser.me/api/portraits/women/63.jpg'
      },
      {
        id: '202',
        name: 'James Wilson',
        position: 'Class Rep',
        description: 'Advocating for more practical sessions',
        image: 'https://randomuser.me/api/portraits/men/41.jpg'
      }
    ]
  }
];

const ElectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simulate API fetch with timeout
    const timer = setTimeout(() => {
      try {
        const foundElection = dummyElections.find(election => election.id === id);
        if (foundElection) {
          setElection(foundElection);
        } else {
          setError('Election not found');
        }
      } catch (err) {
        setError('Failed to load election details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 800); // Simulate network delay

    return () => clearTimeout(timer);
  }, [id]);

  const handleVote = async (candidateId) => {
    try {
      console.log('Voting for:', candidateId);
      // Update the dummy data to mark as voted
      setElection(prev => ({
        ...prev,
        hasVoted: true,
        candidates: prev.candidates.map(c => 
          c.id === candidateId 
            ? { ...c, votes: (c.votes || 0) + 1 } 
            : c
        )
      }));
      setShowModal(false);
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Alert type="error" message={error} />
        <Button onClick={() => navigate('/elections')} className="mt-4">
          Back to Elections
        </Button>
      </div>
    );
  }

  if (!election) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">{election.title}</h1>
        <p className="mt-2 text-gray-600">{election.description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white shadow overflow-hidden sm:rounded-lg mb-8"
      >
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Election Details</h3>
        </div>
        <div className="px-4 py-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Status</h4>
            <p className="mt-1 text-sm text-gray-900 capitalize">
              {election.status}
              {election.status === 'active' && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Ongoing
                </span>
              )}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">End Date</h4>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(election.endDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Total Candidates</h4>
            <p className="mt-1 text-sm text-gray-900">{election.candidates.length}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Your Participation</h4>
            <p className="mt-1 text-sm text-gray-900">
              {election.hasVoted ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Voted
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Not Voted
                </span>
              )}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Candidates</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {election.candidates.map((candidate) => (
            <motion.div
              key={candidate.id}
              whileHover={{ y: -2 }}
              className="bg-white border border-gray-200 rounded-lg p-4 cursor-pointer"
              onClick={() => {
                setSelectedCandidate(candidate);
                setShowModal(true);
              }}
            >
              <div className="flex items-center space-x-4">
                <img
                  className="h-12 w-12 rounded-full object-cover"
                  src={candidate.image || '/default-avatar.png'}
                  alt={candidate.name}
                />
                <div>
                  <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                  <p className="text-sm text-gray-500">{candidate.position}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end space-x-3"
      >
        <Button variant="secondary" onClick={() => navigate('/elections')}>
          Back to Elections
        </Button>
        {election.status === 'active' && !election.hasVoted && (
          <Button onClick={() => navigate(`/vote/${election.id}`)}>
            Vote Now
          </Button>
        )}
        {election.hasVoted && (
          <Button onClick={() => navigate(`/results/${election.id}`)}>
            View Results
          </Button>
        )}
      </motion.div>

      <CandidateModal
        candidate={selectedCandidate}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onVote={() => handleVote(selectedCandidate?.id)}
        canVote={election.status === 'active' && !election.hasVoted}
      />
    </motion.div>
  );
};

export default ElectionDetail;