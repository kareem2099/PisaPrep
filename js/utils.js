// In utils.js - update showResults function
export function showResults(quizData, userAnswers, startTime) {
  let score = 0;
  let feedbackHtml = '';

  quizData.forEach((question, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === question.correctAnswer;
    if (isCorrect) score++;

    feedbackHtml += `
      <div class="question-feedback ${isCorrect ? 'correct' : 'incorrect'}">
        <div class="feedback-header">
          <span class="question-number">السؤال ${index + 1}</span>
          <span class="feedback-status">${isCorrect ? '✓ صحيح' : '✗ خاطئ'}</span>
        </div>
        <div class="question-text">${question.question}</div>
        <div class="user-answer">إجابتك: ${userAnswer || 'بدون إجابة'}</div>
        ${!isCorrect ? `<div class="correct-answer">الإجابة الصحيحة: ${question.correctAnswer}</div>` : ''}
      </div>
    `;
  });

  const percentage = Math.round((score / quizData.length) * 100);
  const timeElapsed = getTimeElapsed(startTime);
  
  return {
    score,
    total: quizData.length,
    percentage,
    timeElapsed,
    feedbackHtml
  };
}

// Update Navigation Buttons
export function updateNavigationButtons(currentQuestionIndex, totalQuestions, prevBtn, nextBtn) {
  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.textContent = currentQuestionIndex === totalQuestions - 1 ? 'إنهاء الاختبار' : 'التالي';
  nextBtn.classList.toggle('finish-btn', currentQuestionIndex === totalQuestions - 1);
}

// Timer functions
export function startTimer(timerElement) {
  let seconds = 0;
  
  const timer = setInterval(() => {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerElement.textContent = `⏱️ ${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, 1000);
  
  return timer;
}

export function stopTimer(timer) {
  clearInterval(timer);
}

export function getTimeElapsed(startTime) {
  const endTime = new Date();
  const elapsed = Math.floor((endTime - startTime) / 1000); // in seconds
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Format time for display
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}