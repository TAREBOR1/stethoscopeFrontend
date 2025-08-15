import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllPosition } from '../../redux/admin/positionSlice';
import { getCandidate } from '../../redux/admin/candidateSlice';
import { getVoteByStudent } from '../../redux/student/voteSlice';
import { 
  Stethoscope, 
  Clock, 
  User, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Vote, 
  Trophy,
  Award,
  GraduationCap,
  ScrollText,
  ShieldCheck
} from 'lucide-react';

const ELECTION_END_TIME = new Date('2025-08-15T22:01:00');

const StudentDashboard = () => {
  const dispatch = useDispatch();

  const { positionList } = useSelector((state) => state.position);
  const { candidateList } = useSelector((state) => state.candidate);
  const { votingList } = useSelector((state) => state.vote);
  const { user } = useSelector((state) => state.auth);
  
  const calculateTimeLeft = () => {
    const now = new Date();
    return Math.max(0, Math.floor((ELECTION_END_TIME - now) / 1000));
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [savedUser, setSavedUser] = useState('');

  useEffect(() => {
    dispatch(getAllPosition());
    dispatch(getCandidate());
    if (user?.id) {
      dispatch(getVoteByStudent(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    const User = JSON.parse(sessionStorage.getItem('user'));
    if (User) {
      setSavedUser(User);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);
      if (newTime <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}h ` : ''}${m}m ${s}s`;
  };

  const hasVotedForPosition = (positionId) => {
    if (!votingList?.elections) return false;
    const election = votingList.elections.find(e => e.id === positionId);
    return election?.hasVoted || false;
  };

  const getPositionIcon = (title) => {
    switch(title.toLowerCase()) {
      case 'president':
        return <ShieldCheck className="w-6 h-6 text-purple-600" />;
      case 'vice president':
        return <Award className="w-6 h-6 text-purple-600" />;
      case 'secretary':
        return <ScrollText className="w-6 h-6 text-purple-600" />;
      case 'treasurer':
        return <GraduationCap className="w-6 h-6 text-purple-600" />;
      default:
        return <Trophy className="w-6 h-6 text-purple-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 z-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNNDY0IDMyMEg0OEMyMS41IDMyMCAwIDI5OC41IDAgMjcyVjE0NGMwLTI2LjUgMjEuNS00OCA0OC00OGg0MTZjMjYuNSAwIDQ4IDIxLjUgNDggNDh2MTI4YzAgMjYuNS0yMS41IDQ4LTQ4IDQ4ek0yNTYgMjg4YzE3LjcgMCAzMi0xNC4zIDMyLTMydi0zMmMwLTE3LjctMTQuMy0zMi0zMi0zMnMtMzIgMTQuMy0zMiAzMnYzMmMwIDE3LjcgMTQuMyAzMiAzMiAzMnoiIGZpbGw9IiA3ZTVhZmYiLz48L3N2Zz4=')] bg-repeat bg-center"></div>
      </div>

      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative bg-gradient-to-r from-purple-900 to-purple-700 text-white shadow-lg overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBkPSJNNDY0IDMyMEg0OEMyMS41IDMyMCAwIDI5OC41IDAgMjcyVjE0NGMwLTI2LjUgMjEuNS00OCA0OC00OGg0MTZjMjYuNSAwIDQ4IDIxLjUgNDggNDh2MTI4YzAgMjYuNS0yMS41IDQ4LTQ4IDQ4ek0yNTYgMjg4YzE3LjcgMCAzMi0xNC4zIDMyLTMydi0zMmMwLTE3LjctMTQuMy0zMi0zMi0zMnMtMzIgMTQuMy0zMiAzMnYzMmMwIDE3LjcgMTQuMyAzMiAzMiAzMnoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] bg-repeat bg-center"></div>
        </div>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <motion.h1 
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center md:justify-start"
              >
                <Stethoscope className="w-10 h-10 mr-3 stroke-[1.5]" />
                Face of Stethoscope
              </motion.h1>
              <p className="text-lg md:text-xl text-purple-100 max-w-2xl">
                Recognizing excellence in medical education and leadership
              </p>
            </div>
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg"
            >
              <div className="flex items-center">
                <Clock className="w-8 h-8 mr-3 text-purple-200 stroke-[1.5]" />
                <div>
                  <p className="text-sm text-purple-100">Election {timeLeft > 0 ? 'ends in' : 'ended'}</p>
                  <p className="text-xl font-bold">
                    {timeLeft > 0 ? formatTime(timeLeft) : 'Voting closed'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10">
        {timeLeft > 0 ? (
          <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Welcome Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-md border border-purple-100 overflow-hidden mb-10"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="bg-purple-100 p-4 rounded-full">
                    <User className="h-8 w-8 text-purple-600 stroke-[1.5]" />
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome, {savedUser.fullName}</h2>
                  <p className="text-gray-600">
                    Your vote helps recognize excellence in our medical community. Review the positions below and make your selections.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Positions Section */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-12"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Voting Positions</h2>
                  <p className="text-gray-600">
                    Select a category to view candidates and cast your vote
                  </p>
                </div>
                <div className="flex items-center bg-purple-50 px-4 py-2 rounded-full">
                  <Users className="w-5 h-5 mr-1.5 text-purple-600 stroke-[1.5]" />
                  <span className="text-sm font-medium text-gray-700">
                    {candidateList?.candidates?.length || 0} candidates
                  </span>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {positionList?.positions?.map((position, index) => {
                  const relatedCandidates = candidateList?.candidates?.filter(
                    (c) => c.position?._id === position._id || c.position === position._id
                  ) || [];

                  const hasVoted = hasVotedForPosition(position._id);

                  return (
                    <motion.div
                      key={position._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 overflow-hidden ${
                        hasVoted ? 'ring-2 ring-purple-500/20' : ''
                      }`}
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-50 rounded-lg mt-1">
                              {getPositionIcon(position.title)}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">{position.title}</h3>
                              {position.description && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {position.description}
                                </p>
                              )}
                            </div>
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              hasVoted ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {hasVoted ? 'Voted ✓' : 'Vote Now'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400 stroke-[1.5]" />
                            {relatedCandidates.length} candidate{relatedCandidates.length !== 1 ? 's' : ''}
                          </div>
                          <div className="h-2 w-full max-w-[120px] bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-purple-500 transition-all duration-500" 
                              style={{ width: `${hasVoted ? 100 : Math.min(100, relatedCandidates.length * 20)}%` }}
                            ></div>
                          </div>
                        </div>

                        <Link
                          to={`/student/positions/${position._id}`}
                          className={`w-full flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                            hasVoted
                              ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow-md'
                          }`}
                        >
                          {hasVoted ? 'View Your Vote' : 'Select Candidate'}
                          <ArrowRight className="w-4 h-4 ml-2 stroke-[2.5]" />
                        </Link>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          </main>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4"
          >
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 max-w-md mx-auto">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-4">
                <Vote className="h-8 w-8 text-purple-600 stroke-[1.5]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Voting Concluded</h2>
              <p className="text-gray-600 mb-6">The "Face of Stethoscope" election has ended. Thank you for your participation!</p>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 text-sm font-medium shadow-sm flex items-center justify-center mx-auto">
                View Election Results
                <ScrollText className="w-4 h-4 ml-2 stroke-[2.5]" />
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;