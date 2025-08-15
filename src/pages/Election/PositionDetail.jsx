import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import CandidateModal from '../../components/Candidates/CandidateModal';

import { getPositionById } from '../../redux/admin/positionSlice';
import { castVote } from '../../redux/student/voteSlice';

const PositionDetail = () => {
  const { id: positionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [votedCandidateId, setVotedCandidateId] = useState(null);

  const { positionDetail, isLoading } = useSelector((state) => state.position);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id && positionId) {
      dispatch(getPositionById({ positionId, userId: user.id }));
    }
  }, [dispatch, positionId, user]);

  useEffect(() => {
    if (positionDetail?.hasVoted && positionDetail?.votedCandidate) {
      setVotedCandidateId(positionDetail.votedCandidate);
    }
  }, [positionDetail]);

  const handleCastVote = async (candidateId) => {
    if (!user?.id || !candidateId || !positionDetail) return;

    const selected = positionDetail.candidates.find((c) => c._id === candidateId);

    const votePayload = {
      student: user.id,
      candidate: candidateId,
      position: positionId,
      election: positionDetail.electionId,
    };

    const result = await dispatch(castVote(votePayload));

    if (result?.payload?.success) {
      setVotedCandidateId(candidateId);
      navigate('/student/vote', {
        state: {
          candidate: {
            name: selected.name,
            image: selected.image || '/default-avatar.png',
            positionTitle: positionDetail.title,
            positionId: positionId,
          },
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="large" />
      </div>
    );
  }

  if (!positionDetail) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert type="error" message="Failed to load position details." />
        <Button onClick={() => navigate('/student')} className="mt-4">
          Back to Election
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 mb-8 shadow-sm">
        <motion.div 
          initial={{ y: -20 }} 
          animate={{ y: 0 }} 
          className="text-center mb-4"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{positionDetail.title}</h1>
          {positionDetail.description && (
            <p className="mt-2 text-lg text-gray-600 max-w-3xl mx-auto">
              {positionDetail.description}
            </p>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Position Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DetailCard 
              label="End Date" 
              value={new Date(positionDetail.endDate).toLocaleDateString()} 
              icon={<CalendarIcon />}
            />
            <DetailCard 
              label="Total Candidates" 
              value={positionDetail.candidates.length} 
              icon={<UsersIcon />}
            />
            <DetailCard 
              label="Your Participation" 
              value={positionDetail.hasVoted ? 'Voted' : 'Not Voted'} 
              status={positionDetail.hasVoted ? 'success' : 'warning'}
              icon={<VoteIcon />}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Quick Actions</h2>
          <div className="space-y-4">
            <Button 
              variant="secondary" 
              onClick={() => navigate('/student')}
              className="w-full"
            >
              Back to Election
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Meet the Candidates</h2>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {positionDetail.candidates.map((candidate) => {
            const isVoted = candidate._id === votedCandidateId;

            return (
              <motion.div
                key={candidate._id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedCandidate(candidate)}
              >
                <div className="p-4 flex flex-col items-center">
                  <div className="relative mb-4">
                    <img
                      src={candidate.image || '/default-avatar.png'}
                      alt={candidate.name}
                      className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    {isVoted && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        Voted
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 text-center">{candidate.name}</h3>
                </div>
                <div className="bg-purple-50 px-4 py-3 text-center">
                  <span className="text-sm font-medium text-purple-600 hover:text-purple-500">
                    View Details
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <CandidateModal
        candidate={selectedCandidate}
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        onVote={() => handleCastVote(selectedCandidate?._id)}
        canVote={!positionDetail.hasVoted}
        votedCandidateId={votedCandidateId}
      />
    </motion.div>
  );
};

const DetailCard = ({ label, value, icon, status }) => {
  const statusColors = {
    success: 'bg-purple-100 text-purple-800',
    warning: 'bg-yellow-100 text-yellow-800',
    default: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="flex items-start space-x-4">
      <div className={`p-3 rounded-lg ${status ? statusColors[status] : statusColors.default}`}>
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-500">{label}</h4>
        <p className="mt-1 text-lg font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
};

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const VoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default PositionDetail;