import { bugs, heb_names } from './config.js';
import { BugInterface } from './types.js';

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

    private createCell(bug: BugInterface, index: number): HTMLElement {
        const cell = document.createElement('div');
        cell.className = 'bug-cell';
        
        const img = document.createElement('img');
        img.src = bug.image;
        img.alt = bug.name;
        
        const name = document.createElement('span');
        name.className = 'bug-name';
        name.textContent = heb_names[bug.name];
        
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
        const lastIndex = this.actions.pop();
        if (lastIndex === undefined) return;
        this.counts[lastIndex]--;
        this.updateDisplay(lastIndex);
    }

    getCounts(): number[] {
        return [...this.counts];
    }

    generateCsv(): string {
        return bugs.map((bug, i) => 
            `${bug.name},${this.counts[i]}`
        ).join('\n');
    }

    clear() {
        this.counts.fill(0);
        this.actions = [];
        bugs.forEach((_, i) => this.updateDisplay(i));
    }
}