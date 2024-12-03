import { Bug } from './types.js';
import { bugs } from './bugs.js';

export class BugDisplay {
    private counts: number[] = new Array(bugs.length).fill(0);
    private actions: number[] = [];
    private grid: HTMLElement;

    constructor(gridElement: HTMLElement) {
        this.grid = gridElement;
        this.setupGrid();
    }

    private setupGrid() {
        this.grid.innerHTML = '';
        bugs.forEach((bug, index) => {
            const cell = this.createCell(bug, index);
            cell.addEventListener('click', () => this.increment(index));
            this.grid.appendChild(cell);
        });
    }

    private createCell(bug: Bug, index: number): HTMLElement {
        const cell = document.createElement('div');
        cell.className = 'bug-cell';
        
        const img = document.createElement('img');
        img.src = bug.image;
        img.alt = bug.name;
        
        const name = document.createElement('span');
        name.className = 'bug-name';
        name.textContent = bug.name;
        
        const count = document.createElement('span');
        count.className = 'bug-count';
        count.id = `count-${index}`;
        count.textContent = '0';
        
        cell.append(name, img, count);
        return cell;
    }

    private updateDisplay(index: number) {
        const el = document.getElementById(`count-${index}`);
        if (el) el.textContent = this.counts[index].toString();
    }

    increment(index: number) {
        this.counts[index]++;
        this.actions.push(index);
        this.updateDisplay(index);
    }

    undo() {
        if (this.actions.length === 0) return;
        const lastIndex = this.actions.pop()!;
        this.counts[lastIndex]--;
        this.updateDisplay(lastIndex);
    }

    getCounts(): number[] {
        return [...this.counts];
    }
    
    getActions(): number[] {
        return [...this.actions];
    }

    generateCsv(): string {
        return bugs.map((bug, i) => 
            `${bug.name},${this.counts[i]}`
        ).join('\n');
    }
}