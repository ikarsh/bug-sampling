import { Bug } from './types';

export class BugGrid {
    private grid: HTMLElement;

    constructor() {
        this.grid = document.getElementById('bugGrid')!;
    }

    setup(bugs: Bug[], onBugClick: (index: number) => void) {
        bugs.forEach((bug, index) => {
            const cell = this.createCell(bug, index);
            cell.addEventListener('click', () => onBugClick(index));
            this.grid.appendChild(cell);
        });
    }

    private createCell(bug: Bug, index: number): HTMLElement {
        const cell = document.createElement('div');
        cell.className = 'bug-cell';
        cell.innerHTML = `
            <span class="bug-name">${bug.name}</span>
            <img src="${bug.image}" alt="${bug.name}">
            <span class="bug-count" id="count-${index}">0</span>
        `;
        return cell;
    }
}