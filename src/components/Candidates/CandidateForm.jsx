import React, { useState } from 'react';
import { User, Briefcase } from 'react-feather';
import Button from '../../components/ui/Button';

const CandidateForm = ({ onSave, onCancel }) => {
  const [candidate, setCandidate] = useState({
    name: '',
    position: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCandidate(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!candidate.name || !candidate.position) return;
    onSave(candidate);
    setCandidate({ name: '', position: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow rounded-md p-6 space-y-4 w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Candidate Information</h2>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="name"
            name="name"
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            value={candidate.name}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
          Position *
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="position"
            name="position"
            className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            value={candidate.position}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={candidate.description}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Add Candidate
        </Button>
      </div>
    </form>
  );
};

export default CandidateForm;
