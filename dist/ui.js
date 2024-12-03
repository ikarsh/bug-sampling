// ui.ts
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
    downloadCsv(filename, content) {
        // const blob = new Blob([content], { type: 'text/csv' });
        // const a = document.createElement('a');
        // a.href = URL.createObjectURL(blob);
        // a.download = filename;
        // a.click();
    }
}
