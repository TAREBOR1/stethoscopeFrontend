import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Loader from '../ui/Loader';
import ElectionCard from './ElectionsCard';

const ElectionList = ({ elections, loading, isAdmin = false }) => {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
          >
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded mt-6 animate-pulse"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {elections.map((election, index) => (
          <motion.div
            key={election.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            exit={{ opacity: 0 }}
            layout
          >
            <ElectionCard 
              election={election} 
              isAdmin={isAdmin} 
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {!loading && elections.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="col-span-full text-center py-12"
        >
          <div className="mx-auto h-24 w-24 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {isAdmin ? 'No elections found' : 'No elections available'}
          </h3>
          <p className="mt-1 text-gray-500">
            {isAdmin ? 'Create a new election to get started' : 'Check back later for upcoming elections'}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ElectionList;