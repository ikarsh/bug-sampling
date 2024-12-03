import { BugDisplay } from './bugDisplay.js';
import { SetupHandler } from './setup.js';
import { showScreen, downloadCsv } from './ui.js';

let currentDisplay: BugDisplay | null = null;
let currentTimerCleanup: (() => void) | null = null;
const setupHandler = new SetupHandler();

function startTimer(duration: number, onEnd: () => void) {
    const timerElement = document.getElementById('timer')!;
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
document.getElementById('undoButton')?.addEventListener('click', () => {
    currentDisplay?.undo();
});

// Setup form submission
document.getElementById('samplingForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const setup = setupHandler.getCurrentSetup();
    
    // Clean up any existing timer
    if (currentTimerCleanup) {
        currentTimerCleanup();
    }
    
    // Initialize new bug display
    const gridElement = document.getElementById('bugGrid')!;
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