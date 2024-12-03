import { bugs } from './bugs.js';
export class BugDisplay {
    constructor(gridElement) {
        this.counts = new Array(bugs.length).fill(0);
        this.actions = [];
        this.grid = gridElement;
        this.setupGrid();
    }
    setupGrid() {
        this.grid.innerHTML = '';
        bugs.forEach((bug, index) => {
            const cell = this.createCell(bug, index);
            cell.addEventListener('click', () => this.increment(index));
            this.grid.appendChild(cell);
        });
    }
    createCell(bug, index) {
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
    updateDisplay(index) {
        const el = document.getElementById(`count-${index}`);
        if (el)
            el.textContent = this.counts[index].toString();
    }
    increment(index) {
        this.counts[index]++;
        this.actions.push(index);
        this.updateDisplay(index);
    }
    undo() {
        const lastIndex = this.actions.pop();
        if (lastIndex === undefined)
            return;
        this.counts[lastIndex]--;
        this.updateDisplay(lastIndex);
    }
    getCounts() {
        return [...this.counts];
    }
    generateCsv() {
        return bugs.map((bug, i) => `${bug.name},${this.counts[i]}`).join('\n');
    }
}
