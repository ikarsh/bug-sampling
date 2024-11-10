import { bugTypes } from './models/bugTypes.js';
import { SamplingSession } from './models/samplingSession.js';
export class ScreenManager {
    constructor() {
        this.screens = document.querySelectorAll('.screen');
    }
    showScreen(screenName) {
        this.screens.forEach(screen => {
            const isTarget = screen.dataset.screen === screenName;
            screen.dataset.active = isTarget.toString();
        });
    }
    getCurrentScreen() {
        return Array.from(this.screens).find(screen => screen.dataset.active === "true")?.dataset.screen;
    }
}
// Global state management
let currentSession = null;
let timerInterval = null;
const screenManager = new ScreenManager();
function setupGrid() {
    const grid = document.getElementById('bugGrid');
    if (!grid)
        return;
    bugTypes.forEach((bug, index) => {
        const cell = document.createElement('div');
        cell.className = 'bug-cell';
        cell.innerHTML = `
            <span class="bug-name">${bug.name}</span>
            <img src="${bug.image}" alt="${bug.name}">
            <span class="bug-count" id="count-${index}">0</span>
        `;
        cell.addEventListener('click', () => {
            if (currentSession) {
                const newCount = currentSession.incrementBug(index);
                const countElement = document.getElementById(`count-${index}`);
                if (countElement) {
                    countElement.textContent = newCount.toString();
                }
            }
        });
        grid.appendChild(cell);
    });
}
function setupUndoButton() {
    const undoButton = document.getElementById('undoButton');
    undoButton?.addEventListener('click', () => {
        if (currentSession) {
            const undoneIndex = currentSession.undo();
            if (undoneIndex !== null) {
                const countElement = document.getElementById(`count-${undoneIndex}`);
                if (countElement) {
                    countElement.textContent = currentSession.counts[undoneIndex].toString();
                }
            }
        }
    });
}
function setupSamplingForm() {
    const form = document.getElementById('samplingForm');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('samplingName');
        const durationInput = document.getElementById('duration');
        if (!nameInput || !durationInput)
            return;
        const name = nameInput.value;
        const duration = parseInt(durationInput.value);
        startNewSession(name, duration);
    });
}
function startNewSession(name, duration) {
    // Clear any existing timer
    if (timerInterval !== null) {
        clearInterval(timerInterval);
    }
    // Start new session
    currentSession = new SamplingSession(name, duration);
    screenManager.showScreen('sampling');
    // Start timer
    let timeLeft = duration;
    const timerDisplay = document.getElementById('timer');
    if (timerDisplay) {
        timerInterval = window.setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = `Time remaining: ${timeLeft}s`;
            if (timeLeft <= 0) {
                if (timerInterval !== null) {
                    clearInterval(timerInterval);
                }
                endSampling();
            }
        }, 1000);
    }
}
function endSampling() {
    if (!currentSession)
        return;
    const csv = currentSession.generateReport();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `sampling_${currentSession.name}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Reset for new sampling
    currentSession = null;
    screenManager.showScreen('setup');
    const form = document.getElementById('samplingForm');
    form?.reset();
    // Reset counts
    bugTypes.forEach((_, index) => {
        const countElement = document.getElementById(`count-${index}`);
        if (countElement) {
            countElement.textContent = '0';
        }
    });
}
// Initialize when the page loads
document.addEventListener('DOMContentLoaded', () => {
    setupGrid();
    setupUndoButton();
    setupSamplingForm();
});
//# sourceMappingURL=main.js.map