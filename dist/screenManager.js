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
import { BugDisplay } from "./bugDisplay.js";
import { bugs } from "./config.js";
import { LocationTracker } from "./utils/locationTracker.js";
import { timer } from "./utils/timer.js";
export class ScreenManager {
    constructor() {
        this.currentScreen = 'session-form-screen';
        this.screens = new Map();
        this.initialize_screens();
        this.run();
    }
    // screen management
    initialize_screens() {
        // add screens to map
        document.querySelectorAll('[data-screen]').forEach(element => {
            const screenName = element.dataset.screen;
            this.screens.set(screenName, element);
        });
        // hide all screens
        this.screens.forEach(element => {
            element.style.display = 'none';
        });
    }
    toggleScreen(show) {
        let curr = this.screens.get(this.currentScreen);
        if (curr) {
            curr.style.display = show ? 'block' : 'none';
        }
        else {
            console.error(`Screen ${this.currentScreen} not found`);
        }
    }
    showScreen(name) {
        this.toggleScreen(false);
        this.currentScreen = name;
        this.toggleScreen(true);
    }
    // event handling
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.toggleScreen(true);
            let locationTracker = new LocationTracker();
            let bugDisplay = new BugDisplay(document.getElementById('bugGrid'));
            // undo button
            (_a = document.getElementById('undoButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                console.log("undo clicked");
                bugDisplay === null || bugDisplay === void 0 ? void 0 : bugDisplay.undo();
            });
            let session_setup = yield awaitForm('sessionForm', () => {
                console.log("session form submitted");
                return {
                    date: new Date(),
                    location: locationTracker.getCurrentLocation(),
                    site: document.getElementById('site').value,
                    treatment: document.getElementById('treatment').value,
                };
            });
            console.log("Got session setup", session_setup);
            let samples = [];
            for (let tree_number = 0; tree_number < 6; tree_number++) {
                console.log("Starting tree", tree_number + 1);
                document.getElementById('sample-name-0').textContent = `Tree ${tree_number + 1}`;
                document.getElementById('sample-name-1').textContent = `Tree ${tree_number + 1}`;
                this.showScreen('sample-form-screen');
                let sample_setup = yield awaitForm('sampleForm', () => {
                    console.log("sample form submitted");
                    return {
                        phenologicalState: parseInt(document.getElementById('PhenologicalState').value),
                        femaleFlowerPercentage: parseInt(document.getElementById('FemaleFlowerPercentage').value),
                        samplingLength: parseInt(document.getElementById('samplingLength').value),
                    };
                });
                console.log("Got sample setup", sample_setup);
                bugDisplay = new BugDisplay(document.getElementById('bugGrid'));
                this.showScreen('sample-screen');
                // wait for timer to finish
                console.log(`Starting timer for ${sample_setup.samplingLength} seconds`);
                yield timer(document.getElementById('timer'), sample_setup.samplingLength);
                // store sample results
                samples.push({
                    phenologicalState: sample_setup.phenologicalState,
                    femaleFlowerPercentage: sample_setup.femaleFlowerPercentage,
                    counts: bugDisplay.getCounts(),
                });
            }
            this.downloadCsv('bugs.csv', this.generateFullCsv(session_setup, samples));
        });
    }
    generateFullCsv(setup, samples) {
        // TODO needs hour also, probably.
        const setupInfo = `Date,${setup.date}\nLocation,${setup.location}\nSite,${setup.site}\nType,${setup.treatment}\n\n`;
        const sampleInfo = samples.map(sample => {
            return `Phenological State,${sample.phenologicalState}\nFemale Flower Percentage,${sample.femaleFlowerPercentage}\n${bugs.map((bug, index) => `${bug.name},${sample.counts[index]}`).join('\n')}\n`;
        }).join('\n');
        return setupInfo + sampleInfo;
    }
    downloadCsv(filename, content) {
        // const blob = new Blob([content], { type: 'text/csv' });
        // const a = document.createElement('a');
        // a.href = URL.createObjectURL(blob);
        // a.download = filename;
        // a.click();
    }
}
function awaitForm(form, handler) {
    console.log(`awaiting form ${form}`);
    return new Promise(resolve => {
        document.getElementById(form).addEventListener('submit', (e) => {
            e.preventDefault();
            resolve(handler());
        }, { once: true });
    });
}
