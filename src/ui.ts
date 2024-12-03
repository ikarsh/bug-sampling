// ui.ts

export type Screen = 'session-form-screen' | 'sample-form-screen' | 'sample-screen';

export class UiState {
    private currentScreen: Screen;
    private screens: Map<Screen, HTMLElement>;
    private timerInterval?: number;
    
    constructor() {
        this.screens = new Map();
        document.querySelectorAll<HTMLElement>('[data-screen]').forEach(element => {
            const screenName = element.dataset.screen as Screen;
            this.screens.set(screenName, element);
        });

        this.currentScreen = 'session-form-screen';
        this.updateScreens();
    }
    private updateScreens() {
        // hide all screens
        this.screens.forEach(element => {
            element.style.display = 'none';
        });

        // show current screen
        const currentElement = this.screens.get(this.currentScreen);
        if (currentElement) {
            currentElement.style.display = 'block';
        } else {
            console.error(`Screen ${this.currentScreen} not found`);
        }
    }
    
    showScreen(name: Screen) {
        this.currentScreen = name;
        this.updateScreens();
    }
    
    async startTimer(duration: number): Promise<void> {
        const timerElement = document.getElementById('timer')!;
        let timeLeft = duration;
        
        this.cleanupTimer();
        
        // show initial state immediately
        timerElement.textContent = `Time: ${timeLeft}s`;
        timeLeft--;
        
        return new Promise((resolve) => {
            this.timerInterval = setInterval(() => {
                timerElement.textContent = `Time: ${timeLeft}s`;
                timeLeft--;
                
                if (timeLeft < 0) {
                    this.cleanupTimer();
                    resolve();
                }
            }, 1000);
        });
    }
    private cleanupTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = undefined;
        }
    }

    downloadCsv(filename: string, content: string) {
        // const blob = new Blob([content], { type: 'text/csv' });
        // const a = document.createElement('a');
        // a.href = URL.createObjectURL(blob);
        // a.download = filename;
        // a.click();
    }
}