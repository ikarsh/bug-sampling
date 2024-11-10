import { bugTypes } from './models/bugTypes.js';
import { SamplingSession } from './models/samplingSession.js';

// Interface definitions
interface HTMLElementWithDataset extends HTMLElement {
    dataset: {
        screen: string;
        active: string;
    };
}

interface Screen extends HTMLElementWithDataset {
    dataset: {
        screen: string;
        active: string;
    };
}

export class ScreenManager {
    private screens: NodeListOf<Screen>;

    constructor() {
        this.screens = document.querySelectorAll<Screen>('.screen');
    }

    showScreen(screenName: string): void {
        this.screens.forEach(screen => {
            const isTarget = screen.dataset.screen === screenName;
            screen.dataset.active = isTarget.toString();
        });
    }

    getCurrentScreen(): string | undefined {
        return Array.from(this.screens).find(screen => 
            screen.dataset.active === "true"
        )?.dataset.screen;
    }
}

// Global state management
let currentSession: SamplingSession | null = null;
let timerInterval: number | null = null;
const screenManager = new ScreenManager();

function setupGrid(): void {
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
                const countElement = document.getElementById(`count-${index}`);
                if (countElement) {
                    countElement.textContent = newCount.toString();
                }
            }
        });
        
        grid.appendChild(cell);
    });
}

function setupUndoButton(): void {
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

function setupSamplingForm(): void {
    const form = document.getElementById('samplingForm');
    form?.addEventListener('submit', (e: Event) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('samplingName') as HTMLInputElement;
        const durationInput = document.getElementById('duration') as HTMLInputElement;
        
        if (!nameInput || !durationInput) return;
        
        const name = nameInput.value;
        const duration = parseInt(durationInput.value);
        
        startNewSession(name, duration);
    });
}

function startNewSession(name: string, duration: number): void {
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

function endSampling(): void {
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
    
    const form = document.getElementById('samplingForm') as HTMLFormElement;
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