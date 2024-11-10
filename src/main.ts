import { bugs } from './bugs.js';
import { BugSession } from './session.js';
import { Timer } from './timer.js';
import { BugGrid } from './grid.js';
import { showScreen, updateCount, downloadCsv } from './ui.js';

let currentSession: BugSession | null = null;
const timer = new Timer(document.getElementById('timer')!);
const grid = new BugGrid();

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
    const name = (document.getElementById('samplingName') as HTMLInputElement).value;
    const duration = parseInt((document.getElementById('duration') as HTMLInputElement).value);
    
    currentSession = new BugSession(name, duration);
    grid.setup(bugs, (index) => {
        if (currentSession) {
            const count = currentSession.increment(index);
            updateCount(index, count);
        }
    });
    
    timer.start(duration, () => {
        if (currentSession) {
            downloadCsv(`bugs_${currentSession.name}.csv`, currentSession.generateCsv());
            currentSession = null;
            showScreen('setup');
        }
    });
    
    showScreen('sampling');
});