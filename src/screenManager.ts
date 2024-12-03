// ui.ts

export type Screen = 'session-form-screen' | 'sample-form-screen' | 'sample-screen';

export class ScreenManager {
    private currentScreen: Screen;
    private screens: Map<Screen, HTMLElement>;
    
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
    

    downloadCsv(filename: string, content: string) {
        // const blob = new Blob([content], { type: 'text/csv' });
        // const a = document.createElement('a');
        // a.href = URL.createObjectURL(blob);
        // a.download = filename;
        // a.click();
    }
}