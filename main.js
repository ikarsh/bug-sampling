import { bugTypes } from './models/BugTypes.js';
import { SamplingSession } from './models/SamplingSession.js';


export class ScreenManager {
    constructor() {
        this.screens = document.querySelectorAll('.screen');
    }

    showScreen(screenName) {
        this.screens.forEach(screen => {
            const isTarget = screen.dataset.screen === screenName;
            screen.dataset.active = isTarget;
        });
    }

    getCurrentScreen() {
        return Array.from(this.screens).find(screen => 
            screen.dataset.active === "true"
        )?.dataset.screen;
    }
}

let currentSession = null;
let timerInterval = null;
const screenManager = new ScreenManager();

function setupGrid() {
    const grid = document.getElementById('bugGrid');
    if (!grid) return;

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
                document.getElementById(`count-${index}`).textContent = newCount;
            }
        });
        
        grid.appendChild(cell);
    });
}

// Setup undo button
document.getElementById('undoButton')?.addEventListener('click', () => {
    if (currentSession) {
        const undoneIndex = currentSession.undo();
        if (undoneIndex !== null) {
            document.getElementById(`count-${undoneIndex}`).textContent = 
                currentSession.counts[undoneIndex];
        }
    }
});

// Setup form submission
document.getElementById('samplingForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('samplingName').value;
    const duration = parseInt(document.getElementById('duration').value);
    
    // Start new session
    currentSession = new SamplingSession(name, duration);
    screenManager.showScreen('sampling');
    
    // Start timer
    let timeLeft = duration;
    const timerDisplay = document.getElementById('timer');
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time remaining: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endSampling();
        }
    }, 1000);
});

function endSampling() {
    if (!currentSession) return;
    
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
    document.getElementById('samplingForm')?.reset();
    
    // Reset counts
    bugTypes.forEach((_, index) => {
        document.getElementById(`count-${index}`).textContent = '0';
    });
}

// Initialize the grid when the page loads
document.addEventListener('DOMContentLoaded', () => {
    setupGrid();
});