const AFK_DELAY = 10000; // 10 seconds
let inactivityTimer;
let countdownInterval;

const elements = {
  overlay: document.getElementById('afk-overlay'),
  countdown: document.getElementById('afk-countdown'),
  video: document.getElementById('afk-video'),
  navbar: document.getElementById('navbar-container'),
  footer: document.getElementById('footer-container'),
  quizApp: document.querySelector('.quiz-app')
};

// Reset on user activity
function resetAFKState() {
  clearTimeout(inactivityTimer);
  clearInterval(countdownInterval);
  
  // Reset all animations
  elements.overlay.classList.add('hidden');
  elements.video.classList.add('hidden');
  elements.video.pause();
  
  // Reset positions
  [elements.navbar, elements.footer].forEach(el => el.classList.remove('slide-up'));
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('slide-left');
    screen.classList.remove('hidden-afk'); // Restore screens
  });
  
  // Restart timer
  inactivityTimer = setTimeout(startAFKSequence, AFK_DELAY);
}

// Countdown then play video
function startAFKSequence() {
  // Slide up navbar/footer
  elements.navbar.classList.add('slide-up');
  elements.footer.classList.add('slide-up');
  
  // Slide left ALL content
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.add('slide-left');
    screen.classList.add('hidden-afk'); // Ensure screens are hidden

  });
  
  // Show countdown after slides complete
  setTimeout(() => {
    elements.overlay.classList.remove('hidden');
    let count = 3;
    
    countdownInterval = setInterval(() => {
      elements.countdown.innerHTML = `<span class="countdown-number">${count}</span>`;
      
      if (count <= 0) {
        clearInterval(countdownInterval);
        elements.overlay.classList.add('hidden');
        playVideo();
      }
      count--;
    }, 1000);
  }, 800); // Match CSS transition duration
}

function playVideo() {
  elements.video.classList.remove('hidden');
  elements.video.play().catch(e => console.log("Video play failed:", e));
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  inactivityTimer = setTimeout(startAFKSequence, AFK_DELAY);
  
  // Reset on any activity
  ['mousemove', 'keydown', 'click', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetAFKState);
  });
});