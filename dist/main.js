var _a, _b;
import { BugDisplay } from './bugDisplay.js';
import { SetupHandler } from './setup.js';
import { showScreen, downloadCsv } from './ui.js';
let currentDisplay = null;
let currentTimerCleanup = null;
const setupHandler = new SetupHandler();
function startTimer(duration, onEnd) {
    const timerElement = document.getElementById('timer');
    let timeLeft = duration;
    const interval = setInterval(() => {
        timerElement.textContent = `Time: ${timeLeft}s`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(interval);
            onEnd();
        }
    }, 1000);
    return () => clearInterval(interval);
}
// Setup undo button
(_a = document.getElementById('undoButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    currentDisplay === null || currentDisplay === void 0 ? void 0 : currentDisplay.undo();
});
// Setup form submission
(_b = document.getElementById('samplingForm')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', (e) => {
    e.preventDefault();
    const setup = setupHandler.getCurrentSetup();
    // Clean up any existing timer
    if (currentTimerCleanup) {
        currentTimerCleanup();
    }
    // Initialize new bug display
    const gridElement = document.getElementById('bugGrid');
    currentDisplay = new BugDisplay(gridElement);
    // Start timer
    currentTimerCleanup = startTimer(setup.samplingLength, () => {
        if (currentDisplay) {
            downloadCsv('bugs.csv', currentDisplay.generateCsv());
            currentDisplay = null;
            showScreen('setup');
        }
    });
    showScreen('sampling');
});
