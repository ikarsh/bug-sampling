export class Timer {
    constructor(timerElement) {
        this.timerElement = timerElement;
        this.timerInterval = null;
    }
    start(duration, onEnd) {
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
    updateDisplay(seconds) {
        this.timerElement.textContent = `Time: ${seconds}s`;
    }
    stop() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
}
