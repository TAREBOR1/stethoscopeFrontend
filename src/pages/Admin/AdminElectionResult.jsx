import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Share2 } from 'react-feather';
import { Bar } from 'react-chartjs-2';
import { getResultsByPosition } from '../../redux/admin/resultSlice';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminElectionResults = () => {
  const { positionId } = useParams();
  const dispatch = useDispatch();
  const { results, isLoading } = useSelector((state) => state.results);

  console.log(positionId,'first')
  console.log(results,'second')

  useEffect(() => {
    if (positionId) {
      dispatch(getResultsByPosition(positionId));
    }
  }, [dispatch, positionId]);

  if (isLoading || !results) {
    return <div className="p-8">Loading...</div>;
  }

  const chartData = {
    labels: results.candidates.map(c => c.name),
    datasets: [
      {
        label: 'Votes',
        data: results.candidates.map(c => c.votes),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1
      }
    ]
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 10 }
      }
    },
    plugins: { legend: { display: false } }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/admin/dashboard" className="mr-4 p-1 rounded-full hover:bg-gray-100">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{results.positionTitle} Results</h1>
          </div>
          <div className="flex space-x-3">
            <button className="btn-icon">
              <Printer className="mr-2 h-4 w-4" /> Print
            </button>
            <button className="btn-icon">
              <Download className="mr-2 h-4 w-4" /> Export
            </button>
            <button className="btn-primary">
              <Share2 className="mr-2 h-4 w-4" /> Share
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <Stat label="Total Votes" value={`${results.totalVotesCast} / ${results.totalVoters}`} color="indigo" />
          <Stat label="Participation Rate" value={`${results.participationRate}%`} color="green" />
          <Stat
            label="Winner"
            value={results.candidates[0]?.name}
            subtitle={`${results.candidates[0]?.votes} votes`}
            image={results.candidates[0]?.image}
          />
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Vote Distribution</h3>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detailed Results</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Candidate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Votes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.candidates.map((c, idx) => (
                  <tr key={c._id}>
                    <td className="px-6 py-4 flex items-center">
                      <img src={c.image} alt={c.name} className="h-10 w-10 rounded-full mr-4" />
                      <span>{c.name}</span>
                    </td>
                    <td className="px-6 py-4">{c.votes}</td>
                    <td className="px-6 py-4">{c.percentage}%</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${idx === 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {idx === 0 ? 'Winner' : 'Runner-up'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const Stat = ({ label, value, color = 'indigo', subtitle, image }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-1">{label}</h3>
      {image ? (
        <div className="flex items-center mt-2">
          <img src={image} alt={label} className="h-10 w-10 rounded-full mr-3" />
          <div>
            <p className="text-lg font-semibold text-gray-900">{value}</p>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          </div>
        </div>
      ) : (
        <p className={`mt-2 text-3xl font-semibold text-${color}-600`}>{value}</p>
      )}
    </div>
  );
};

export default AdminElectionResults;
