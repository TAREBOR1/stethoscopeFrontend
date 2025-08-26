import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const CandidateModal = ({ candidate, isOpen, onClose, onVote, canVote, votedCandidateId }) => {
  if (!candidate) return null;

  const hasVotedForThisCandidate = votedCandidateId === candidate._id;
  const firstName = candidate.name.split(' ')[0];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Candidate Profile`} 
      size="lg"
    >
      <div className="flex flex-col items-center p-4 overflow-hidden max-h-[80vh]">
        {/* Candidate Profile Section */}
        <div className="flex flex-col items-center mb-6 w-full flex-shrink-0">
          <div className="relative mb-4">
            <img
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-md"
              src={candidate.image || '/default-avatar.png'}
              alt={`${candidate.name}'s profile`}
              onError={(e) => (e.target.src = '/default-avatar.png')}
            />
            {hasVotedForThisCandidate && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Voted
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 text-center">{candidate.name}</h3>
        </div>

        {/* Manifesto Section */}


        {/* {candidate.manifesto && (
          <div className="w-full bg-purple-50 rounded-lg p-4 mb-6 flex-grow overflow-hidden">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Manifesto</h4>
            <div className="bg-white p-4 rounded-md border border-gray-200 max-h-[200px] overflow-y-auto">
              <p className="text-gray-700 whitespace-pre-line">{candidate.manifesto}</p>
            </div>
          </div>
        )} */}

        {/* Action Buttons */}
        {canVote && (
          <div className="flex flex-col sm:flex-row justify-center gap-3 w-full mt-4 flex-shrink-0">
            <Button 
              variant="secondary" 
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => { onVote(); onClose(); }}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white"
            >
              Vote for {firstName}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CandidateModal;