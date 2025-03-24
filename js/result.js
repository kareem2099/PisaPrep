import { formatTime } from './utils.js';

// DOM Elements
const scorePercentageEl = document.getElementById('score-percentage');
const scoreTextEl = document.getElementById('score-text');
const badgesContainer = document.querySelector('.badges-container');
const shareBtn = document.getElementById('share-btn');
const certificateBtn = document.getElementById('certificate-btn');

// Create popup container
const popupContainer = document.createElement('div');
popupContainer.id = 'custom-popup';
document.body.appendChild(popupContainer);

// Localization
const messages = {
  perfectScore: "ممتاز! أنت عبقري في الرياضيات! 🎯",
  goodScore: "جيد جداً! لديك فهم قوي للرياضيات. 👍",
  averageScore: "ليس سيئاً! يمكنك التحسن بالممارسة. 💪",
  lowScore: "تحتاج إلى مزيد من الدراسة. لا تستسلم! 📚",
  noResults: "لا توجد نتائج متاحة. الرجاء البدء بالاختبار أولاً.",
  copied: "تم نسخ النتيجة إلى الحافظة!",
  shareError: "تعذر مشاركة النتيجة، يرجى المحاولة لاحقاً",
  certificateError: "بيانات الشهادة غير صالحة"
};

// Achievement criteria
const achievements = [
  {
    condition: (p, t) => p === 100,
    text: "العلامة الكاملة!",
    icon: "🏆",
    class: "gold"
  },
  {
    condition: (p, t) => p >= 90,
    text: "عبقري الرياضيات",
    icon: "🧠",
    class: "purple"
  },
  {
    condition: (p, t) => t < 120, // Under 2 minutes
    text: "سريع جداً!",
    icon: "⚡",
    class: "blue"
  },
  {
    condition: (p, t) => p >= 80 && t < 180,
    text: "سريع ودقيق",
    icon: "🎯",
    class: "green"
  }
];

// Load results from localStorage
const results = JSON.parse(localStorage.getItem('quizResults'));
if (!results) {
  sessionStorage.setItem('errorMessage', messages.noResults);
  window.location.href = 'index.html';
}

// Display results with animations
function displayResults() {
  const { score, total, percentage, timeElapsed } = results;
  
  // Update score display with animation
  scorePercentageEl.textContent = `${percentage}%`;
  document.documentElement.style.setProperty('--percentage', `${percentage}%`);
  scorePercentageEl.classList.add('bounce-in');
  
  // Set score text based on percentage
  let message;
  if (percentage >= 90) message = messages.perfectScore;
  else if (percentage >= 70) message = messages.goodScore;
  else if (percentage >= 50) message = messages.averageScore;
  else message = messages.lowScore;
  
  // Animate text appearance
  setTimeout(() => {
    scoreTextEl.innerHTML = `
      <p>أجبت بشكل صحيح على <strong>${score}</strong> من أصل <strong>${total}</strong> سؤال</p>
      <p>الوقت المستغرق: <strong>${timeElapsed}</strong></p>
      <p class="result-message">${message}</p>
    `;
    scoreTextEl.classList.add('slide-in-bottom');
  }, 300);
  
  // Add achievements with delay
  setTimeout(() => {
    addAchievements(percentage, convertTimeToSeconds(timeElapsed));
    badgesContainer.classList.add('fade-in');
  }, 600);
}

// Convert MM:SS to seconds
function convertTimeToSeconds(timeStr) {
  const [mins, secs] = timeStr.split(':').map(Number);
  return mins * 60 + secs;
}

// Add achievement badges
function addAchievements(percentage, timeInSeconds) {
  const earnedAchievements = achievements.filter(a => 
    a.condition(percentage, timeInSeconds)
  );
  
  if (earnedAchievements.length > 0) {
    earnedAchievements.forEach((achievement, index) => {
      setTimeout(() => {
        const badge = document.createElement('div');
        badge.className = `badge ${achievement.class} zoom-in`;
        badge.innerHTML = `
          <span class="badge-icon">${achievement.icon}</span>
          <span class="badge-text">${achievement.text}</span>
        `;
        badgesContainer.appendChild(badge);
      }, index * 200);
    });
  } else {
    badgesContainer.innerHTML = `
      <div class="encouragement fade-in">
        <p>استمر في المحاولة! كل جهد يقربك من النجاح.</p>
      </div>
    `;
  }
}

// Show popup notification
function showPopup(message) {
  popupContainer.innerHTML = `
    <div class="popup-content">
      <div class="popup-message">${message}</div>
    </div>
  `;
  popupContainer.style.display = 'flex';
  
  // Auto-close after 3 seconds
  setTimeout(() => {
    popupContainer.classList.add('fade-out');
    setTimeout(() => {
      popupContainer.style.display = 'none';
      popupContainer.classList.remove('fade-out');
    }, 300);
  }, 3000);
}

// Share results with fallback
async function shareResults() {
  try {
    const { score, total, percentage } = results;
    const shareData = {
      title: 'نتيجتي في اختبار الرياضيات',
      text: `حصلت على ${score}/${total} (${percentage}%) في اختبار الرياضيات! 🧮`,
      url: window.location.href
    };

    // Debug: Check if share API is available
    console.log('Share API available:', !!navigator.share);
    console.log('Can share:', await navigator.canShare?.(shareData));

    if (navigator.share && navigator.canShare?.(shareData)) {
      await navigator.share(shareData);
      console.log('Share successful');
    } else {
      try {
        await navigator.clipboard.writeText(shareData.text);
        showPopup(messages.copied);
        console.log('Copied to clipboard');
      } catch (clipboardErr) {
        const textArea = document.createElement('textarea');
        textArea.value = shareData.text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          showPopup(messages.copied);
        } catch (execErr) {
            console.error('ExecCommand error:', execErr);
          // Don't show popup for manual copy fallback
        }
        document.body.removeChild(textArea);
      }
    }
  } catch (err) {
    console.error('Sharing failed:', err);
    showPopup(messages.shareError);
  }
}

// Generate certificate with validation
function generateCertificate() {
  const { score, total, percentage } = results;
  
  if (typeof score !== 'number' || typeof total !== 'number' || typeof percentage !== 'number') {
    showPopup(messages.certificateError);
    return;
  }

  const params = new URLSearchParams();
  params.append('score', score);
  params.append('total', total);
  params.append('percentage', percentage);
  params.append('date', new Date().toLocaleDateString('ar-EG'));
  
  window.open(`certificate.html?${params.toString()}`, '_blank', 'noopener,noreferrer');
}

// Event Listeners
shareBtn.addEventListener('click', shareResults);
certificateBtn.addEventListener('click', generateCertificate);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', displayResults);