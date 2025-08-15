import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { getAllPosition } from '../../redux/admin/positionSlice';
import { getCandidate } from '../../redux/admin/candidateSlice';

import { getAllVotes } from '../../redux/student/voteSlice';
import { getAllUser } from '../../redux/userSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { positionList } = useSelector((state) => state.position);
  const { candidateList } = useSelector((state) => state.candidate);
  const { userList } = useSelector((state) => state.user);
  const { votingList } = useSelector((state) => state.vote);

  useEffect(() => {
    dispatch(getAllPosition());
    dispatch(getCandidate());
    dispatch(getAllUser());
    dispatch(getAllVotes());
  }, [dispatch]);

  const ongoingPositions = positionList?.positions || [];

  const totalVotesCast = votingList?.votes?.length || 0;
  const totalVoters = userList?.users?.length || 1;
  const participationRate = Math.round((totalVotesCast / totalVoters) * 100);
  const totalCandidates = candidateList?.candidates?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <Link
            to="/admin/create-election"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow hover:bg-indigo-700"
          >
            Create New Election
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard label="Ongoing Elections" value={ongoingPositions.length} color="indigo" />
          <StatCard label="Total Votes Cast" value={totalVotesCast} color="green" />
          <StatCard label="Participation Rate" value={`${participationRate}%`} color="yellow" />
          <StatCard label="Total Candidates" value={totalCandidates} color="purple" />
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Ongoing Elections</h3>
            <p className="mt-1 text-sm text-gray-500">Manage currently active positions</p>
          </div>
          <div className="divide-y divide-gray-200">
            {ongoingPositions.map((position) => {
              const votesForThisPosition = votingList?.votes?.filter(
                (v) => v.position === position._id
              ).length;

              const candidatesForThisPosition = candidateList?.candidates?.filter(
                (c) => c.position?._id === position._id || c.position === position._id
              ).length;

              const startDate = new Date(position.createdAt).toLocaleDateString();
              const endDate = new Date(position.election?.endDate || position.endDate).toLocaleDateString();
              const participation = Math.round((votesForThisPosition / totalVoters) * 100);

              return (
                <div key={position._id} className="px-4 py-5 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{position.title}</h4>
                      <p className="text-sm text-gray-500">{startDate} - {endDate}</p>
                      <p className="text-sm text-gray-500">
                        {candidatesForThisPosition} candidate{candidatesForThisPosition !== 1 && 's'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="mb-2 text-sm font-semibold text-blue-600">
                        {participation}% participation
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/view/${position._id}`}
                          className="px-3 py-1 text-sm rounded-md bg-white border border-gray-300 hover:bg-gray-100"
                        >
                          View
                        </Link>
                        <Link
                          to={`/admin/result/${position._id}`}
                          className="px-3 py-1 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          Results
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">{userList?.users?.length || 0} registered students</p>
              <Link
                to="/admin/users"
                className="text-sm text-indigo-600 hover:underline"
              >
                View All Students
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/admin/register-candidate"
                className="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Register Candidate
              </Link>
              <Link
                to="/admin/manage-candidates"
                className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Manage Candidates
              </Link>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Election Tools</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/admin/create-election"
                className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-center"
              >
                New Election
              </Link>
              <Link
                to="/admin/past-elections"
                className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-center"
              >
                Past Elections
              </Link>
              <Link
                to="/admin/election-settings"
                className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-center"
              >
                Election Settings
              </Link>
              <Link
                to="/admin/voter-lists"
                className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-center"
              >
                Voter Lists
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ label, value, color }) => {
  const colors = {
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="bg-white shadow rounded-lg p-5">
      <div className="flex items-center">
        <div className={`p-3 rounded-md ${colors[color]}`}>
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
