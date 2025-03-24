// Render Question Card
export function renderQuestion(question, index, totalQuestions, userAnswer = null, relatedQuestions = []) {
  let html = `
    <div class="question-card">
  `;

  // Question content
  if (question.header) {
    html += `<div class="question-header">${question.header}</div>`;
  }

  if (question.img) {
    html += `<img src="${question.img}" alt="Question Image" class="q-img" loading="lazy">`;
  }

  if (question.difficulty) {
    html += `<div class="question-meta">
      <span class="question-difficulty ${question.difficulty.toLowerCase()}">${question.difficulty}</span>
    </div>`;
  }

  if (question.body) {
    html += `<div class="question-body">${question.body}</div>`;
  }

  html += `<div class="question-text">${question.question}</div>`;

  // Multiple-choice answers
  if (question.type === "mcq") {
    html += `<div class="options-container">`;
    
    Object.entries(question.answers).forEach(([key, value]) => {
      const isChecked = userAnswer === key;
      html += `
        <label class="option ${isChecked ? 'selected' : ''}">
          <input 
            type="radio" 
            name="choice" 
            value="${key}" 
            ${isChecked ? 'checked' : ''}
            onchange="this.closest('.option').classList.toggle('selected', this.checked)"
          >
          <span class="option-text">${value}</span>
          <span class="option-selector"></span>
        </label>
      `;
    });
    
    html += `</div>`;
  }

  // Related questions notification and popup trigger
// In renderQuestion function:
if (relatedQuestions && relatedQuestions.length > 0) {
  console.log(`Rendering ${relatedQuestions.length} related questions for Q${index + 1}`);
  
  html += `
    <div class="related-questions-notice">
      <div class="related-notice-text">
        <i class="fas fa-info-circle"></i>
        هذا السؤال لديه ${relatedQuestions.length} أسئلة مرتبطة
      </div>
      <button class="view-related-btn" data-question-index="${index}">
        <i class="fas fa-eye"></i> عرض الأسئلة المرتبطة
      </button>
    </div>
    
    <div class="related-questions-modal modal" id="related-modal-${index}">
      <div class="modal-content">
        <span class="close-modal">&times;</span>
        <h3>الأسئلة المرتبطة</h3>
        <div class="related-questions-container"></div>
      </div>
    </div>
  `;
} else {
  console.log(`No related questions for Q${index + 1}`);
}

  html += `</div>`; // Close question-card

  return html;
}

// Save User Answer
export function saveAnswer(question, userAnswers, currentQuestionIndex) {
  if (question.type === "mcq") {
    const selectedOption = document.querySelector('input[name="choice"]:checked');
    userAnswers[currentQuestionIndex] = selectedOption ? selectedOption.value : null;
  } else if (question.type === "text") {
    const textAnswer = document.querySelector('textarea').value.trim();
    userAnswers[currentQuestionIndex] = textAnswer || null;
  }
}