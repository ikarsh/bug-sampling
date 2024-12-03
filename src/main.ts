// main.ts
import { BugDisplay } from './bugDisplay.js';
import { SetupHandler } from './setup.js';
import { UiState } from './ui.js';

let currentDisplay: BugDisplay | null = null;
const setupHandler = new SetupHandler();
const ui = new UiState();

// Setup undo button
document.getElementById('undoButton')?.addEventListener('click', () => {
    currentDisplay?.undo();
});

// Setup form submission
document.getElementById('samplingForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const setup = setupHandler.getCurrentSetup();
    
    // Initialize new bug display
    const gridElement = document.getElementById('bugGrid')!;
    currentDisplay = new BugDisplay(gridElement);
    
    ui.showScreen('sampling');
    
    // wait for timer to finish
    await ui.startTimer(setup.samplingLength);
    
    // handle completion
    if (currentDisplay) {
        ui.downloadCsv('bugs.csv', currentDisplay.generateCsv());
        currentDisplay = null;
        ui.showScreen('setup');
    }
});