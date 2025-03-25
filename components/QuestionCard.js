// Render Question Card
export function renderQuestion(question, index, totalQuestions, userAnswer = null, relatedQuestions = []) {
  let html = `
    <div class="question-card" data-question-id="${question.id}">
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
  if (relatedQuestions && relatedQuestions.length > 0) {
    html += `
      <div class="related-questions-notice">
        <div class="related-notice-text">
          <i class="fas fa-info-circle"></i>
          هذا السؤال لديه ${relatedQuestions.length} أسئلة مرتبطة
        </div>
        <button class="view-related-btn" data-question-id="${question.id}">
          <i class="fas fa-eye"></i> عرض الأسئلة المرتبطة
        </button>
      </div>
      
      <div class="related-questions-list">
        ${relatedQuestions.map(relatedQ => `
          <div class="related-question-item" data-related-id="${relatedQ.id}">
            <div class="related-question-preview">
              <span class="related-question-title">${relatedQ.question.substring(0, 60)}${relatedQ.question.length > 60 ? '...' : ''}</span>
              <button class="view-related-question-btn" data-related-id="${relatedQ.id}">
                <i class="fas fa-eye"></i> عرض
              </button>
            </div>
          </div>
        `).join('')}
      </div>
      
      <!-- Individual related question modals -->
      ${relatedQuestions.map(relatedQ => `
        <div class="related-question-modal" id="related-modal-${relatedQ.id}">
          <div class="modal-content">
            <span class="close-modal" data-related-id="${relatedQ.id}">&times;</span>
            <div class="related-question-details">
              ${relatedQ.header ? `<h4 class="related-question-header">${relatedQ.header}</h4>` : ''}
              ${relatedQ.img ? `<img src="${relatedQ.img}" class="related-q-img" loading="lazy">` : ''}
              ${relatedQ.difficulty ? `
                <div class="related-question-meta">
                  <span class="related-question-difficulty ${relatedQ.difficulty.toLowerCase()}">
                    ${relatedQ.difficulty}
                  </span>
                </div>
              ` : ''}
              ${relatedQ.body ? `<div class="related-question-body">${relatedQ.body}</div>` : ''}
              <div class="related-question-text">${relatedQ.question}</div>
            </div>
          </div>
        </div>
      `).join('')}
    `;
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

// Initialize modal functionality (call this after rendering questions)
export function initRelatedQuestionsModals() {
  // Handle view related questions button clicks
  document.querySelectorAll('.view-related-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const questionId = this.getAttribute('data-question-id');
      const relatedList = document.querySelector(`.question-card[data-question-id="${questionId}"] .related-questions-list`);
      
      if (relatedList) {
        if (relatedList.style.display === 'block') {
          relatedList.style.display = 'none';
        } else {
          relatedList.style.display = 'block';
        }
      }
    });
  });

  // Handle view individual related question button clicks
  document.querySelectorAll('.view-related-question-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const relatedId = this.getAttribute('data-related-id');
      const modal = document.getElementById(`related-modal-${relatedId}`);
      
      if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // Handle close modal button clicks
  document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', function() {
      const relatedId = this.getAttribute('data-related-id');
      const modal = document.getElementById(`related-modal-${relatedId}`);
      
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  });

  // Close modal when clicking outside
  document.querySelectorAll('.related-question-modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        this.style.display = 'none';
        document.body.style.overflow = '';
      }
    });
  });
}
