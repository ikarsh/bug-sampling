export class Timer {
    private timerInterval: number | null = null;
    
    constructor(private timerElement: HTMLElement) {}

    start(duration: number, onEnd: () => void) {
        let timeLeft = duration;
        this.updateDisplay(timeLeft);
        
        this.timerInterval = window.setInterval(() => {
            timeLeft--;
            this.updateDisplay(timeLeft);
            
            if (timeLeft <= 0) {
                this.stop();
                onEnd();
            }
        }, 1000);
    }

    private updateDisplay(seconds: number) {
        this.timerElement.textContent = `Time: ${seconds}s`;
    }

    stop() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
}