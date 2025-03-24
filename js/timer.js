/**
 * Timer Module for Math Quiz App
 * Provides startTimer, stopTimer, and getTimeElapsed functions
 */

let timerInterval;
let startTimestamp;
let elapsedSeconds = 0;

/**
 * Starts the quiz timer and updates the display element
 * @param {HTMLElement} timerElement - The DOM element to display the timer
 * @returns {number} The timer interval ID
 */
export function startTimer(timerElement) {
  // Reset any existing timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  // Initialize timer state
  startTimestamp = Date.now() - (elapsedSeconds * 1000);
  
  // Update immediately
  updateTimerDisplay(timerElement);
  
  // Set up interval (update every second)
  timerInterval = setInterval(() => {
    elapsedSeconds = Math.floor((Date.now() - startTimestamp) / 1000);
    updateTimerDisplay(timerElement);
  }, 1000);

  return timerInterval;
}

/**
 * Stops the quiz timer
 * @param {number} timer The timer interval ID to stop
 */
export function stopTimer(timer) {
  clearInterval(timer);
  timerInterval = null;
}

/**
 * Gets the formatted time elapsed since quiz started
 * @param {Date} [startTime] Optional start time if not using module's timer
 * @returns {string} Formatted time string (MM:SS)
 */
export function getTimeElapsed(startTime) {
  if (startTime) {
    // Calculate from provided start time (used in quiz finish)
    const seconds = Math.floor((new Date() - startTime) / 1000);
    return formatTime(seconds);
  }
  // Use module's internal timer
  return formatTime(elapsedSeconds);
}

/**
 * Formats seconds into MM:SS display format
 * @param {number} totalSeconds Total elapsed seconds
 * @returns {string} Formatted time string
 */
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Updates the timer display element
 * @param {HTMLElement} timerElement The DOM element to update
 */
function updateTimerDisplay(timerElement) {
  if (!timerElement) return;
  
  const currentSeconds = Math.floor((Date.now() - startTimestamp) / 1000);
  const minutes = Math.floor(currentSeconds / 60);
  const seconds = currentSeconds % 60;
  
  timerElement.textContent = `⏱️ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  // Add visual feedback when time is running out
  if (minutes >= 5) {
    timerElement.classList.add('critical');
  }
}

/**
 * Resets the timer module's internal state
 */
export function resetTimer() {
  elapsedSeconds = 0;
  startTimestamp = null;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}