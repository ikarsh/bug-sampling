// ui.ts

export type Screen = 'setup' | 'subsession-form' | 'sampling';

export class UiState {
    private currentScreen: Screen = 'setup';
    private timerInterval?: number;
    
    constructor() {
        this.updateScreens();
    }
    private updateScreens() {
        const setupScreen = document.querySelector<HTMLElement>('[data-screen="setup"]');
        const subsessionScreen = document.querySelector<HTMLElement>('[data-screen="subsession-form"]');
        const samplingScreen = document.querySelector<HTMLElement>('[data-screen="sampling"]');
        
        console.log("screens:", {setupScreen, subsessionScreen, samplingScreen});
        console.log("current screen:", this.currentScreen);
        
        if (!setupScreen || !subsessionScreen || !samplingScreen) return;
        
        setupScreen.style.display = this.currentScreen === 'setup' ? 'block' : 'none';
        subsessionScreen.style.display = this.currentScreen === 'subsession-form' ? 'block' : 'none';
        samplingScreen.style.display = this.currentScreen === 'sampling' ? 'block' : 'none';
    }
    
    showScreen(name: Screen) {
        this.currentScreen = name;
        this.updateScreens();
    }

    async startTimer(duration: number): Promise<void> {
        const timerElement = document.getElementById('timer')!;
        let timeLeft = duration;

        // clean up any existing timer
        this.cleanupTimer();
        
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