// main.ts
import { bugs } from './bugs.js';
import { BugSession } from './session.js';
import { showScreen, updateCount, downloadCsv } from './ui.js';
let currentSession = null;
function setupGrid() {
    const grid = document.getElementById('bugGrid');
    bugs.forEach((bug, index) => {
        const cell = document.createElement('div');
        cell.className = 'bug-cell';
        cell.innerHTML = `
            <span class="bug-name">${bug.name}</span>
            <img src="${bug.image}" alt="${bug.name}">
            <span class="bug-count" id="count-${index}">0</span>
        `;
        cell.addEventListener('click', () => {
            if (currentSession) {
                const count = currentSession.increment(index);
                updateCount(index, count);
            }
        });
        grid.appendChild(cell);
    });
}
function setupForm() {
    const form = document.getElementById('samplingForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('samplingName').value;
        const duration = parseInt(document.getElementById('duration').value);
        currentSession = new BugSession(name, duration);
        currentSession.startTimer(() => {
            if (currentSession) {
                const csv = currentSession.generateCsv();
                downloadCsv(`bugs_${currentSession.name}.csv`, csv);
                currentSession = null;
                showScreen('setup');
            }
        });
        showScreen('sampling');
    });
}
function setupUndo() {
    const undoBtn = document.getElementById('undoButton');
    undoBtn.addEventListener('click', () => {
        if (currentSession) {
            const index = currentSession.undo();
            if (index !== null) {
                updateCount(index, currentSession.counts[index]);
            }
        }
    });
}
// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    setupGrid();
    setupForm();
    setupUndo();
});
