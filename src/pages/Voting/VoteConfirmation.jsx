import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

const VoteConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const candidate = state?.candidate || {
    _id: 'dummyCandidateId',
    name: 'Alex Johnson',
    positionTitle: 'President',
    positionId: 'dummyPositionId',
    image: '/avatars/alex.jpg',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-purple-50"
    >
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        {/* Centered Check Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="bg-purple-100 rounded-full p-4 flex items-center justify-center mb-6 shadow-lg"
        >
          <svg
            className="h-12 w-12 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </motion.div>

        {/* Centered Text Content */}
        <div className="text-center w-full">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold text-gray-900 mb-3"
          >
            Vote Submitted!
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 mb-8"
          >
            Thank you for participating in the election
          </motion.p>
        </div>

        {/* Vote Summary Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100 w-full"
        >
          <div className="bg-purple-700 p-4 text-center">
            <h2 className="text-lg font-semibold text-white">Your Vote</h2>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img
                  className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md"
                  src={candidate.image}
                  alt={candidate.name}
                />
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                  Voted
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
              <p className="text-gray-600 mb-4">{candidate.positionTitle}</p>
              
              <div className="bg-purple-50 rounded-lg px-3 py-2 w-full border border-purple-100">
                <p className="text-purple-800 font-medium text-sm">
                  You voted for {candidate.name.split(' ')[0]} as {candidate.positionTitle}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Centered Button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full flex justify-center"
        >
          <Button
            onClick={() => navigate('/student')}
            className="w-full max-w-xs py-3 bg-purple-600 hover:bg-purple-700 text-white"
          >
            Back to Election
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VoteConfirmation;