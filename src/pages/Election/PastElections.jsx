import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ElectionList from '../../components/Elections/ElectionList';
import Loader from '../../components/ui/Loader';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
 import { dummyElections } from '../..';

const PastElections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      const pastElections = dummyElections.filter(e => e.status === 'completed');
      setElections(pastElections);
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
          <h1 className="text-3xl font-bold text-gray-900">Past Elections</h1>
          <p className="mt-2 text-gray-600">View results from completed elections</p>
        </motion.div>
        <Link to="/elections">
          <Button variant="secondary" size="small">
            View Active Elections
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader size="large" />
        </div>
      ) : (
        <>
          <ElectionList elections={elections} loading={loading} isPast />
          {!loading && elections.length === 0 && (
            <EmptyState
              icon="archive"
              title="No Past Elections"
              description="There are no completed elections to display"
              actionText="View Active Elections"
              actionLink="/elections"
            />
          )}
        </>
      )}
    </motion.div>
  );
};

export default PastElections;