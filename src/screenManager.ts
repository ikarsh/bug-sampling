// ui.ts

import { BugDisplay } from "./bugDisplay.js";
import { bugs, SITES, TREATMENTS } from "./config.js";
// import { SessionFormHandler } from "./sessionFormHandler";
import { Sample, SessionSetup, Treatment } from "./types.js";
import { LocationTracker } from "./utils/locationTracker.js";
import { timer } from "./utils/timer.js";

export type Screen = 'session-form-screen' | 'sample-form-screen' | 'sample-screen';

export class ScreenManager {
    private currentScreen: Screen;
    private screens: Map<Screen, HTMLElement>;
    
    constructor() {
        this.currentScreen = 'session-form-screen';
        this.screens = new Map();
        
        this.initialize_screens();

        this.run();
    }

    // screen management

    private initialize_screens() {
        // add screens to map
        document.querySelectorAll<HTMLElement>('[data-screen]').forEach(element => {
            const screenName = element.dataset.screen as Screen;
            this.screens.set(screenName, element);
        });
        
        // hide all screens
        this.screens.forEach(element => {
            element.style.display = 'none';
        });
    }
    
    toggleScreen(show: boolean) {
        let curr = this.screens.get(this.currentScreen);
        if (curr) {
            curr.style.display = show? 'block' : 'none';
        }
        else {
            console.error(`Screen ${this.currentScreen} not found`);
        }
    }

    showScreen(name: Screen) {
        this.toggleScreen(false);
        this.currentScreen = name;
        this.toggleScreen(true);
    }

    // event handling

    private async run() {
        this.toggleScreen(true);
        let locationTracker = new LocationTracker();

        let bugDisplay = new BugDisplay(document.getElementById('bugGrid')!);
        // undo button
        document.getElementById('undoButton')?.addEventListener('click', () => {
            console.log("undo clicked");
            bugDisplay?.undo();
        });

        let session_setup = await awaitForm('sessionForm', () => {
            console.log("session form submitted");
            return {
                date: new Date(),
                location: locationTracker.getCurrentLocation(),
                site: (document.getElementById('site') as HTMLSelectElement).value as SessionSetup['site'],
                treatment: (document.getElementById('treatment') as HTMLSelectElement).value as Treatment,
            } as SessionSetup;
        });

        console.log("Got session setup", session_setup);

        let samples: Sample[] = [];

        for (let tree_number = 0; tree_number < 6; tree_number++) {
            console.log("Starting tree", tree_number + 1);

            document.getElementById('sample-name-0')!.textContent = `Tree ${tree_number + 1}`;
            document.getElementById('sample-name-1')!.textContent = `Tree ${tree_number + 1}`;

            this.showScreen('sample-form-screen');
            let sample_setup = await awaitForm('sampleForm', () => {
                console.log("sample form submitted");
                return {
                    phenologicalState: parseInt((document.getElementById('PhenologicalState') as HTMLInputElement).value),
                    femaleFlowerPercentage: parseInt((document.getElementById('FemaleFlowerPercentage') as HTMLInputElement).value),
                    samplingLength: parseInt((document.getElementById('samplingLength') as HTMLInputElement).value),
                };
            });
            console.log("Got sample setup", sample_setup);

            bugDisplay = new BugDisplay(document.getElementById('bugGrid')!);
            this.showScreen('sample-screen');

            // wait for timer to finish
            console.log(`Starting timer for ${sample_setup.samplingLength} seconds`);
            await timer(document.getElementById('timer')!, sample_setup.samplingLength);

            // store sample results
            samples.push({
                phenologicalState: sample_setup.phenologicalState,
                femaleFlowerPercentage: sample_setup.femaleFlowerPercentage,
                counts: bugDisplay.getCounts(),
            } as Sample);
        }
        
        this.downloadCsv('bugs.csv', this.generateFullCsv(session_setup, samples));
    }

    private generateFullCsv(setup: SessionSetup, samples: Sample[]): string {
        // TODO needs hour also, probably.
        const setupInfo = `Date,${setup.date}\nLocation,${setup.location}\nSite,${setup.site}\nType,${setup.treatment}\n\n`;
        const sampleInfo = samples.map(sample => {
            return `Phenological State,${sample.phenologicalState}\nFemale Flower Percentage,${sample.femaleFlowerPercentage}\n${bugs.map((bug, index) => `${bug.name},${sample.counts[index]}`).join('\n')}\n`;
        }).join('\n');
        return setupInfo + sampleInfo;
    }

    downloadCsv(filename: string, content: string) {
        // const blob = new Blob([content], { type: 'text/csv' });
        // const a = document.createElement('a');
        // a.href = URL.createObjectURL(blob);
        // a.download = filename;
        // a.click();
    }
}

function awaitForm<T>(form: string, handler: () => T): Promise<T> {
    console.log(`awaiting form ${form}`);
    return new Promise(resolve => {
        document.getElementById(form)!.addEventListener('submit', (e) => {
            e.preventDefault();
            resolve(handler());
        }, { once: true });
    });
}