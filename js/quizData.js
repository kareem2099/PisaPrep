const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes cache

export async function fetchQuizData() {
  try {
    // Check cache first
    const cachedData = getCachedData();
    if (cachedData) return cachedData;

    const response = await fetch('./data/questions.json', { 
      cache: 'force-cache',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Process and flatten the data
    const quizData = data.flatMap((core) => 
      core.questions.map(q => ({
        ...q,
        category: core.category,
        difficulty: core.difficulty
        
      }))
    );

    // Shuffle questions and cache
    const shuffledData = shuffleArray(quizData).slice(0, 15); // Get 15 random questions
    cacheData(shuffledData);
    
    return shuffledData;
  } catch (error) {
    console.error('Failed to load quiz data:', error);
    // Try to return cached data if available
    return getCachedData() || [];
  }
}

// Cache management
function cacheData(data) {
  const cache = {
    data,
    timestamp: Date.now()
  };
  localStorage.setItem('quizDataCache', JSON.stringify(cache));
}

function getCachedData() {
  const cache = JSON.parse(localStorage.getItem('quizDataCache'));
  if (cache && (Date.now() - cache.timestamp < CACHE_DURATION)) {
    return cache.data;
  }
  return null;
}

// Helper function to shuffle array
function shuffleArray(array) {
  return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}