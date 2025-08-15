import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { formatDate } from '../../utils/helper';

const ElectionCard = ({ election, isAdmin = false }) => {
  // Calculate participation percentage safely
  const participationRate = election.totalVoters > 0 
    ? Math.round((election.votesCast / election.totalVoters) * 100) 
    : 0;

  // Determine election status
  const now = new Date();
  const startDate = new Date(election.startDate);
  const endDate = new Date(election.endDate);
  
  let status = 'upcoming';
  if (now >= startDate && now <= endDate) status = 'active';
  if (now > endDate) status = 'completed';

  // Determine button configuration
  const getButtonConfig = () => {
    if (isAdmin) {
      return {
        primary: { text: 'Manage', to: `/admin/elections/${election.id}`, variant: 'secondary' },
        secondary: { text: 'Results', to: `/admin/elections/${election.id}/results` }
      };
    }

    if (status === 'active') {
      return election.hasVoted
        ? { text: 'View Results', to: `/results/${election.id}` }
        : { text: 'Vote Now', to: `/vote/${election.id}` };
    }

    return {
      text: status === 'completed' ? 'View Results' : 'Election Pending',
      to: `/results/${election.id}`,
      disabled: status === 'upcoming'
    };
  };

  const buttonConfig = getButtonConfig();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-200 hover:shadow-lg"
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{election.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{election.description}</p>
          </div>
          
          {election.hasVoted && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Voted
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(election.startDate)} - {formatDate(election.endDate)}
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {election.candidatesCount} candidate{election.candidatesCount !== 1 ? 's' : ''}
          </div>
        </div>

        {isAdmin && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Participation</span>
              <span className="text-sm font-medium text-gray-900">{participationRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{ width: `${participationRate}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          {isAdmin ? (
            <>
              <Link to={buttonConfig.primary.to} className="flex-1">
                <Button variant={buttonConfig.primary.variant} className="w-full">
                  {buttonConfig.primary.text}
                </Button>
              </Link>
              <Link to={buttonConfig.secondary.to} className="flex-1">
                <Button className="w-full">
                  {buttonConfig.secondary.text}
                </Button>
              </Link>
            </>
          ) : (
            <Link to={buttonConfig.to} className="flex-1">
              <Button 
                className="w-full" 
                disabled={buttonConfig.disabled}
              >
                {buttonConfig.text}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ElectionCard;