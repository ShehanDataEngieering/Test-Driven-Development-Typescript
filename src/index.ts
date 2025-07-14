import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'TDD TypeScript CRUD API',
    status: 'Tests written, implementation pending...',
    tddPhase: 'RED - Tests are failing (as expected)'
  });
});

app.listen(PORT, () => {
  console.log(`🔴 TDD Server running on port ${PORT}`);
  console.log('📝 Tests are written and failing - ready for implementation!');
  console.log('💡 Run "npm test" to see the failing tests');
  console.log('🎯 Start implementing UserRepository.create() method first');
});
