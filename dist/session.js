import { bugs } from './bugs.js';
export class BugSession {
    constructor(duration) {
        this.duration = duration;
        this.counts = new Array(bugs.length).fill(0);
        this.actions = [];
    }
    increment(index) {
        this.counts[index]++;
        this.actions.push(index);
        return this.counts[index];
    }
    undo() {
        if (this.actions.length === 0)
            return null;
        const lastIndex = this.actions.pop();
        this.counts[lastIndex]--;
        return lastIndex;
    }
    generateCsv() {
        let csv = `Bug Type,Count\n`;
        bugs.forEach((bug, i) => {
            csv += `${bug.name},${this.counts[i]}\n`;
        });
        return csv;
    }
}
