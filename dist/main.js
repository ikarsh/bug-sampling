var _a, _b;
import { bugs } from './bugs.js';
import { BugSession } from './session.js';
import { Timer } from './timer.js';
import { BugGrid } from './grid.js';
import { showScreen, updateCount, downloadCsv } from './ui.js';
let currentSession = null;
const timer = new Timer(document.getElementById('timer'));
const grid = new BugGrid();
// Setup undo button
(_a = document.getElementById('undoButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    if (currentSession) {
        const index = currentSession.undo();
        if (index !== null) {
            updateCount(index, currentSession.counts[index]);
        }
    }
});
(_b = document.getElementById('samplingForm')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('samplingName').value;
    const duration = parseInt(document.getElementById('duration').value);
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
