import { BugDisplay } from "./bugDisplay.js";
import { SAMPLE_SIDES } from "./config.js";
import { SessionStateManager } from "./sessionState.js";
import { LocationTracker } from "./utils/locationTracker.js";
import { timer } from "./utils/timer.js";
export class ScreenManager {
    currentScreen;
    screens;
    bugDisplay;
    stateManager;
    constructor() {
        this.stateManager = new SessionStateManager();
        this.currentScreen = this.stateManager.getCurrentScreen();
        this.screens = new Map();
        this.bugDisplay = new BugDisplay(document.getElementById('bugGrid'));
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
        console.log(`showing screen ${name}`);
        this.toggleScreen(false);
        this.currentScreen = name;
        this.stateManager.setCurrentScreen(name);
        this.toggleScreen(true);
    }
    // event handling
    async run() {
        this.toggleScreen(true);
        let locationTracker = new LocationTracker();
        // undo button
        document.getElementById('undoButton')?.addEventListener('click', () => {
            console.log("undo clicked");
            this.bugDisplay?.undo();
        });
        // reset button
        document.getElementById('resetButton')?.addEventListener('click', () => {
            if (confirm('Are you sure? This will delete all collected data.')) {
                this.stateManager.clearSession();
                this.showScreen('session-form-screen');
            }
        });
        // If we have existing session setup, skip to sample selection
        const existingSetup = this.stateManager.getSetup();
        if (existingSetup) {
            this.setupSampleSelection();
            return;
        }
        // Otherwise wait for new session setup
        const sessionSetup = await awaitForm('sessionForm', () => {
            console.log("session form submitted");
            return {
                date: new Date(),
                location: locationTracker.getCurrentLocation(),
                site: document.getElementById('site').value,
                treatment: document.getElementById('treatment').value,
                sampleAmount: parseInt(document.getElementById('treeAmount').value),
            };
        });
        console.log("Got session setup", sessionSetup);
        this.stateManager.setSetup(sessionSetup);
        this.setupSampleSelection();
    }
    setupSampleSelection() {
        let sampleSelectionElement = document.getElementById('sample-selection-grid');
        const sessionSetup = this.stateManager.getSetup();
        let sampleAmount = sessionSetup.sampleAmount;
        const completionGrid = this.stateManager.getCompletionGrid();
        populateSampleSelectionScreen(sampleSelectionElement, sampleAmount, (row, col) => this.startSample(row, col), completionGrid);
        this.showScreen('sample-selection-screen');
    }
    async startSample(row, col) {
        console.log(`Starting sample ${row}${col}`);
        // Set the title to the correct sample name.
        let sequence = document.getElementsByClassName('sample-name');
        let name = `Tree ${col}, ${row}`;
        Array.from(sequence).forEach(e => e.textContent = name);
        this.showScreen('sample-form-screen');
        let sample_setup = await awaitForm('sampleForm', () => {
            console.log("sample form submitted");
            return {
                phenologicalState: parseInt(document.getElementById('PhenologicalState').value),
                femaleFlowerPercentage: parseInt(document.getElementById('FemaleFlowerPercentage').value),
                samplingLength: parseInt(document.getElementById('samplingLength').value),
            };
        });
        console.log("Got sample setup", sample_setup);
        this.bugDisplay = new BugDisplay(document.getElementById('bugGrid'));
        this.showScreen('sample-screen');
        // wait for timer to finish
        console.log(`Starting timer for ${sample_setup.samplingLength} seconds`);
        await timer(document.getElementById('timer'), sample_setup.samplingLength);
        // clear previous comments
        document.getElementById('comments').value = '';
        this.showScreen('comments-screen');
        const comments = await awaitForm('commentsForm', () => {
            return document.getElementById('comments').value;
        });
        // store sample results
        const sample = {
            phenologicalState: sample_setup.phenologicalState,
            femaleFlowerPercentage: sample_setup.femaleFlowerPercentage,
            samplingLength: sample_setup.samplingLength,
            counts: this.bugDisplay.getCounts(),
            comments,
        };
        this.stateManager.setSample(col - 1, row, sample);
        let samples = this.stateManager.getSamples();
        if (this.stateManager.allSamplesCollected()) {
            console.log("All samples collected", samples);
            // this.downloadCsv('bugs.csv', this.generateFullCsv(session_setup, this.samples as Sample[][]));
            this.stateManager.clearSession();
            this.showScreen('session-form-screen');
        }
        else {
            this.setupSampleSelection();
        }
    }
    generateFullCsv(setup, samples) {
        // // TODO needs hour also, probably.
        // const setupInfo = `Date,${setup.date}\nLocation,${setup.location}\nSite,${setup.site}\nType,${setup.treatment}\n\n`;
        // const sampleInfo = samples.map(sample => {
        //     return `Phenological State,${sample.phenologicalState}\nFemale Flower Percentage,${sample.femaleFlowerPercentage}\n${bugs.map((bug, index) => `${bug.name},${sample.counts[index]}`).join('\n')}\n`;
        // }).join('\n');
        // return setupInfo + sampleInfo;
        return "";
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
function populateSampleSelectionScreen(grid, sampleAmount, startSample, completionGrid) {
    // Set grid columns CSS variable
    document.documentElement.style.setProperty('--grid-columns', sampleAmount.toString());
    grid.innerHTML = '';
    const cornerCell = document.createElement('div');
    grid.appendChild(cornerCell);
    // Column numbers
    for (let i = 1; i <= sampleAmount; i++) {
        const cell = document.createElement('div');
        cell.className = 'col-label';
        cell.textContent = i.toString();
        grid.appendChild(cell);
    }
    // Row names
    SAMPLE_SIDES.forEach(row => {
        const label = document.createElement('div');
        label.className = 'row-label';
        label.textContent = row;
        grid.appendChild(label);
        for (let col = 1; col <= sampleAmount; col++) {
            const cell = document.createElement('div');
            cell.className = 'sample-cell';
            cell.textContent = `${row}${col}`;
            if (completionGrid[col - 1][row]) {
                cell.classList.add('completed');
            }
            else {
                cell.addEventListener('click', () => {
                    cell.classList.add('completed');
                    startSample(row, col);
                }, { once: true });
            }
            grid.appendChild(cell);
        }
    });
}
