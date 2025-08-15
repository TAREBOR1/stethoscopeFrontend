export const dummyElections = [
  {
    id: '1',
    title: 'Class President Election',
    description: 'Vote for your class president for the academic year 2023-2024',
    startDate: '2023-12-01T08:00:00',
    endDate: '2023-12-15T17:00:00',
    status: 'active',
    candidates: [
      {
        id: '101',
        name: 'Alex Johnson',
        position: 'President',
        image: '/avatars/alex.jpg',
        bio: '3rd year Computer Science student',
        manifesto: 'I will improve class participation and organize more tech workshops'
      },
      {
        id: '102',
        name: 'Sarah Williams',
        position: 'President',
        image: '/avatars/sarah.jpg',
        bio: '2nd year Business Administration student',
        manifesto: 'Focus on better communication between faculty and students'
      }
    ],
    hasVoted: false,
    totalVoters: 150,
    votesCast: 87
  },
  {
    id: '2',
    title: 'Student Council Representative',
    description: 'Elect your department representative to the student council',
    startDate: '2023-11-15T08:00:00',
    endDate: '2023-11-30T17:00:00',
    status: 'completed',
    candidates: [
      {
        id: '201',
        name: 'Michael Chen',
        position: 'Council Rep',
        image: '/avatars/michael.jpg',
        bio: '4th year Engineering student',
        manifesto: 'Advocate for better lab equipment and research opportunities'
      }
    ],
    hasVoted: true,
    totalVoters: 120,
    votesCast: 98
  }
];