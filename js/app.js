import { fetchQuizData } from './quizData.js';
import { renderQuestion, saveAnswer } from '../components/QuestionCard.js';
import { showResults, updateNavigationButtons } from './utils.js';
import { startTimer, stopTimer, getTimeElapsed, resetTimer } from './timer.js';

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const startBtn = document.getElementById('start-btn');
const quizContainer = document.getElementById('quiz-content');
const resultsContainer = document.getElementById('results');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentQuestionEl = document.getElementById('current-question');
const totalQuestionsEl = document.getElementById('total-questions');
const progressFill = document.getElementById('progress-fill');
const timerEl = document.getElementById('timer');
const questionIndicators = document.getElementById('question-indicators');

// Quiz State
const quizState = {
  currentQuestionIndex: 0,
  userAnswers: [],
  quizData: [],
  timer: null,
  startTime: null
};

// Initialize Quiz
async function initializeQuiz() {
  try {
    quizState.quizData = await fetchQuizData();
    
    if (quizState.quizData.length === 0) {
      throw new Error('No questions available');
    }

    // Initialize user answers array
    quizState.userAnswers = new Array(quizState.quizData.length).fill(null);
    
    // Set total questions
    totalQuestionsEl.textContent = quizState.quizData.length;
    
    // Create question indicators
    createQuestionIndicators();
    
    // Update progress bar
    updateProgressBar();
  } catch (error) {
    console.error('Quiz initialization failed:', error);
    showErrorModal('فشل في تحميل بيانات الاختبار. الرجاء المحاولة لاحقًا.');
  }
}

// Create question navigation indicators
function createQuestionIndicators() {
  questionIndicators.innerHTML = '';
  quizState.quizData.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.className = 'question-indicator';
    indicator.dataset.index = index;
    indicator.addEventListener('click', () => navigateToQuestion(index));
    questionIndicators.appendChild(indicator);
  });
  updateQuestionIndicators();
}

// Update question indicators
function updateQuestionIndicators() {
  document.querySelectorAll('.question-indicator').forEach((indicator, index) => {
    indicator.classList.toggle('answered', quizState.userAnswers[index] !== null);
    indicator.classList.toggle('current', index === quizState.currentQuestionIndex);
  });
}

// Navigate to specific question
function navigateToQuestion(index) {
  saveCurrentAnswer();
  quizState.currentQuestionIndex = index;
  renderCurrentQuestion();
}

// Update progress bar
function updateProgressBar() {
  const answeredCount = quizState.userAnswers.filter(answer => answer !== null).length;
  const progress = (answeredCount / quizState.quizData.length) * 100;
  progressFill.style.width = `${progress}%`;
}

// Start Quiz
startBtn.addEventListener('click', async () => {
  startScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  
  // Start timer
  quizState.startTime = new Date();
  quizState.timer = startTimer(timerEl);
  
  renderCurrentQuestion();
});

// Render Current Question
function renderCurrentQuestion() {
  const question = quizState.quizData[quizState.currentQuestionIndex];
  
  quizContainer.innerHTML = renderQuestion(
    question,
    quizState.currentQuestionIndex,
    quizState.quizData.length,
    quizState.userAnswers[quizState.currentQuestionIndex]
  );
  
  // Update UI elements
  currentQuestionEl.textContent = quizState.currentQuestionIndex + 1;
  updateNavigationButtons(
    quizState.currentQuestionIndex, 
    quizState.quizData.length, 
    prevBtn, 
    nextBtn
  );
  updateQuestionIndicators();
  updateProgressBar();
  
  // Add animation
  quizContainer.classList.add('question-enter');
  setTimeout(() => quizContainer.classList.remove('question-enter'), 600);
}

// Save current answer
function saveCurrentAnswer() {
  const currentQuestion = quizState.quizData[quizState.currentQuestionIndex];
  saveAnswer(currentQuestion, quizState.userAnswers, quizState.currentQuestionIndex);
}

// Navigation Handlers
prevBtn.addEventListener('click', () => {
  saveCurrentAnswer();
  quizState.currentQuestionIndex--;
  renderCurrentQuestion();
});

nextBtn.addEventListener('click', () => {
  saveCurrentAnswer();
  
  if (quizState.currentQuestionIndex === quizState.quizData.length - 1) {
    finishQuiz();
  } else {
    quizState.currentQuestionIndex++;
    renderCurrentQuestion();
  }
});

// Finish Quiz
function finishQuiz() {
  stopTimer(quizState.timer);
  const timeElapsed = getTimeElapsed(quizState.startTime);
  
  // Calculate score
  const score = calculateScore();
  const total = quizState.quizData.length;
  const percentage = Math.round((score / total) * 100);
  
  // Store results in localStorage
  localStorage.setItem('quizResults', JSON.stringify({
    score,
    total,
    percentage,
    timeElapsed,
    answers: quizState.userAnswers
  }));
  
  // Redirect to results page
  window.location.href = 'result.html';
}

// Calculate final score
function calculateScore() {
  return quizState.quizData.reduce((score, question, index) => {
    if (question.type === "mcq" && 
        quizState.userAnswers[index] === question.correctAnswer) {
      return score + 1;
    }
    return score;
  }, 0);
}

// Error Modal
function showErrorModal(message) {
  const modal = document.createElement('div');
  modal.className = 'error-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <p>${message}</p>
      <button class="modal-close">حسناً</button>
    </div>
  `;
  document.body.appendChild(modal);
  
  modal.querySelector('.modal-close').addEventListener('click', () => {
    modal.remove();
  });
}

// Initialize the quiz when the page loads
document.addEventListener('DOMContentLoaded', initializeQuiz);