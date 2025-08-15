import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { dummyElections } from '../..';
import ElectionList from '../../components/Elections/ElectionList';

const ActiveElections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      const activeElections = dummyElections.filter(e => e.status === 'active');
      setElections(activeElections);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <motion.div initial={{ y: -20 }} animate={{ y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900">Active Elections</h1>
          <p className="mt-2 text-gray-600">Participate in ongoing elections</p>
        </motion.div>
        <Link to="/past-elections">
          <Button variant="secondary" size="small">
            View Past Elections
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader size="large" />
        </div>
      ) : (
        <>
          <ElectionList elections={elections} loading={loading} />
          {!loading && elections.length === 0 && (
            <EmptyState
              icon="election"
              title="No Active Elections"
              description="There are currently no elections available for voting"
              actionText="Check Past Elections"
              actionLink="/past-elections"
            />
          )}
        </>
      )}
    </motion.div>
  );
};

export default ActiveElections;