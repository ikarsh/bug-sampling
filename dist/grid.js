export class BugGrid {
    constructor() {
        this.grid = document.getElementById('bugGrid');
    }
    setup(bugs, onBugClick) {
        bugs.forEach((bug, index) => {
            const cell = this.createCell(bug, index);
            cell.addEventListener('click', () => onBugClick(index));
            this.grid.appendChild(cell);
        });
    }
    createCell(bug, index) {
        const cell = document.createElement('div');
        cell.className = 'bug-cell';
        const name = document.createElement('span');
        name.className = 'bug-name';
        name.textContent = bug.name;
        const img = document.createElement('img');
        img.src = bug.image;
        img.alt = bug.name;
        const count = document.createElement('span');
        count.className = 'bug-count';
        count.id = `count-${index}`;
        count.textContent = '0';
        cell.append(name, img, count);
        return cell;
    }
}
