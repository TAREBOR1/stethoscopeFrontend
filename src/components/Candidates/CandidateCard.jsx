import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';

const CandidateCard = ({ candidate, isSelected = false, onSelect = () => {} }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              className="h-16 w-16 rounded-full object-cover border-2 border-white"
              src={candidate.image || '/default-avatar.png'}
              alt={`${candidate.name}'s profile`}
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
            {isSelected && (
              <div className="absolute -top-2 -right-2 bg-indigo-600 rounded-full p-1">
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-gray-900 truncate">{candidate.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{candidate.position}</p>
          <p className="text-sm text-gray-600 line-clamp-2">{candidate.bio}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          size="small"
          variant={isSelected ? 'primary' : 'secondary'}
          className="text-sm"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
        >
          {isSelected ? 'Selected' : 'Select'}
        </Button>
      </div>
    </motion.div>
  );
};

export default CandidateCard;