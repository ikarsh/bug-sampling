// session.ts
import { Session } from './types.js';
import { bugs } from './bugs.js';

export class BugSession implements Session {
    public counts: number[];
    public actions: number[];
    private timerInterval: number | null = null;

    constructor(
        public name: string,
        public duration: number
    ) {
        this.counts = new Array(bugs.length).fill(0);
        this.actions = [];
    }

    startTimer(onEnd: () => void) {
        let timeLeft = this.duration;
        const timerEl = document.getElementById('timer')!;
        
        this.timerInterval = window.setInterval(() => {
            timeLeft--;
            timerEl.textContent = `Time: ${timeLeft}s`;
            
            if (timeLeft <= 0) {
                if (this.timerInterval) {
                    clearInterval(this.timerInterval);
                }
                onEnd();
            }
        }, 1000);
    }

    increment(index: number): number {
        this.counts[index]++;
        this.actions.push(index);
        return this.counts[index];
    }

    undo(): number | null {
        if (this.actions.length === 0) return null;
        const lastIndex = this.actions.pop()!;
        this.counts[lastIndex]--;
        return lastIndex;
    }

    generateCsv(): string {
        let csv = `Bug Type,Count\n`;
        bugs.forEach((bug, i) => {
            csv += `${bug.name},${this.counts[i]}\n`;
        });
        return csv;
    }
}