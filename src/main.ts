import { bugs } from './bugs.js';
import { BugSession } from './session.js';
import { Timer } from './timer.js';
import { BugGrid } from './grid.js';
import { showScreen, updateCount, downloadCsv } from './ui.js';
import { SetupHandler } from './setup.js';

let currentSession: BugSession | null = null;
const timer = new Timer(document.getElementById('timer')!);
const grid = new BugGrid();
const setupHandler = new SetupHandler();

// Setup undo button
document.getElementById('undoButton')?.addEventListener('click', () => {
    if (currentSession) {
        const index = currentSession.undo();
        if (index !== null) {
            updateCount(index, currentSession.counts[index]);
        }
    }
});

document.getElementById('samplingForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const setup = setupHandler.getCurrentSetup();
    
    currentSession = new BugSession(setup.site, setup.samplingLength);
    grid.setup(bugs, (index) => {
        if (currentSession) {
            const count = currentSession.increment(index);
            updateCount(index, count);
        }
    });
    
    timer.start(setup.samplingLength, () => {
        if (currentSession) {
            downloadCsv(`bugs_${currentSession.name}.csv`, currentSession.generateCsv());
            currentSession = null;
            showScreen('setup');
        }
    });
    
    showScreen('sampling');
});