// ui.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class UiState {
    constructor() {
        this.screens = new Map();
        document.querySelectorAll('[data-screen]').forEach(element => {
            const screenName = element.dataset.screen;
            this.screens.set(screenName, element);
        });
        this.currentScreen = 'session-form-screen';
        this.updateScreens();
    }
    updateScreens() {
        // hide all screens
        this.screens.forEach(element => {
            element.style.display = 'none';
        });
        // show current screen
        const currentElement = this.screens.get(this.currentScreen);
        if (currentElement) {
            currentElement.style.display = 'block';
        }
        else {
            console.error(`Screen ${this.currentScreen} not found`);
        }
    }
    showScreen(name) {
        this.currentScreen = name;
        this.updateScreens();
    }
    startTimer(duration) {
        return __awaiter(this, void 0, void 0, function* () {
            const timerElement = document.getElementById('timer');
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
        });
    }
    cleanupTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = undefined;
        }
    }
    downloadCsv(filename, content) {
        // const blob = new Blob([content], { type: 'text/csv' });
        // const a = document.createElement('a');
        // a.href = URL.createObjectURL(blob);
        // a.download = filename;
        // a.click();
    }
}
