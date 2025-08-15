import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { getCandidate } from '../../redux/admin/candidateSlice';
import { getAllUser } from '../../redux/userSlice';
import { getAllVotes } from '../../redux/student/voteSlice';

const AdminElectionView = () => {
  const { positionId } = useParams();
  const dispatch = useDispatch();

  const { candidateList } = useSelector((state) => state.candidate);
  const { userList } = useSelector((state) => state.user);
  const { votingList } = useSelector((state) => state.vote);

  const [expandedCandidateId, setExpandedCandidateId] = useState(null);

  useEffect(() => {
    dispatch(getCandidate());
    dispatch(getAllUser());
    dispatch(getAllVotes());
  }, [dispatch]);

  // ✅ Filter only candidates for this position
  const candidatesForPosition = candidateList?.candidates?.filter(
    (c) => c.position === positionId || c.position?._id === positionId
  );

  // ✅ Filter only valid votes (those with a candidate & matching position)
  const validVotes = votingList?.votes?.filter(
    (v) =>
      v?.candidate &&
      v?.candidate?.position &&
      (v?.candidate?.position === positionId || v?.candidate?.position?._id === positionId)
  ) || [];

  // ✅ Get voters for each candidate
  const getVotersForCandidate = (candidateId) => {
    const candidateVotes = validVotes.filter((v) => v.candidate._id === candidateId);
    const voterIds = candidateVotes.map((v) => v.student?._id);
    return userList?.users?.filter((u) => voterIds.includes(u._id)) || [];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Candidates for this Position</h1>

      {candidatesForPosition?.length === 0 ? (
        <p className="text-gray-500">No candidates found for this position.</p>
      ) : (
        <div className="space-y-4">
          {candidatesForPosition.map((candidate) => {
            const isOpen = expandedCandidateId === candidate._id;
            const voters = getVotersForCandidate(candidate._id);

            return (
              <div key={candidate._id} className="border rounded-md p-4 bg-white shadow-sm">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setExpandedCandidateId(isOpen ? null : candidate._id)
                  }
                >
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {candidate.name}
                    </h2>
                    <p className="text-sm text-gray-500">{candidate.description}</p>
                  </div>
                  <button className="text-indigo-600 text-sm">
                    {isOpen ? 'Hide Voters ▲' : 'Show Voters ▼'}
                  </button>
                </div>

                {isOpen && (
                  <div className="mt-4 border-t pt-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                      {voters.length} Student{voters.length !== 1 ? 's' : ''} voted for {candidate.name}
                    </h3>
                    <ul className="space-y-1">
                      {voters.map((voter) => (
                        <li key={voter._id} className="text-sm text-gray-800 pl-2 border-l-2 border-indigo-400">
                          {voter.fullName} ({voter.matricNumber})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminElectionView;
