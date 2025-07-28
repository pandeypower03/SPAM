const express = require('express');
const router = express.Router();
// Skip database setup for now, use mock data

const mockProblems = [
  {
    id: 1,
    title: 'Two Sum',
    description: 'Given an array of integers...',
    difficulty: 'easy',
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' }
    ]
  }
];

// Get all problems
router.get('/', (req, res) => {
   console.log('Fetching all problems');
  res.json(mockProblems);
});

// Get single problem
router.get('/:id', (req, res) => {
  const problem = mockProblems.find(p => p.id == req.params.id);
  res.json(problem);
});

// Submit solution
router.post('/:id/submit', (req, res) => {
  const { code, language } = req.body;
  // For now, just return mock result
  res.json({
    recieved:{ code, language },
    status: 'accepted',
    runtime: '12ms',
    memory: '14.2MB',
    testsPassed: 2,
    totalTests: 2
  });
});

module.exports = router;