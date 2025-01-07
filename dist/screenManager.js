import { BugDisplay } from "./bugDisplay.js";
import { SAMPLE_SIDES } from "./config.js";
import { generateAndDownloadCsv } from "./csvGenerator.js";
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
        this.bugDisplay = new BugDisplay(document.getElementById('bugGrid'));
        this.screens = new Map();
        this.initialize_screens();
        this.currentScreen = this.stateManager.getCurrentScreen();
        this.initializeButtons();
        // If we have existing session setup, skip to sample selection
        const existingSetup = this.stateManager.getSetup();
        if (existingSetup) {
            this.setupSampleSelection();
        }
        else {
            this.selectSessionSetup();
        }
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
    initializeButtons() {
        // undo button
        let undoButton = clean_listeners(document.getElementById('undoButton'));
        undoButton.addEventListener('click', () => {
            console.log("undo clicked");
            this.bugDisplay?.undo();
        });
        // reset button
        let resetButton = clean_listeners(document.getElementById('resetButton'));
        resetButton.addEventListener('click', () => {
            if (confirm('Are you sure? This will delete all collected data.')) {
                this.reset();
            }
        });
    }
    reset() {
        this.stateManager.clearSession();
        window.location.reload();
    }
    async selectSessionSetup() {
        this.showScreen('session-form-screen');
        let locationTracker = new LocationTracker();
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
        const sessionSetup = this.stateManager.getSetup();
        let sampleSelectionTitle = document.getElementById('sample-selection-title');
        sampleSelectionTitle.textContent = `${sessionSetup.site}, ${sessionSetup.treatment}`;
        // This could be more efficient but it's fine.
        let sampleSelectionElement = document.getElementById('sample-selection-grid');
        const completionGrid = this.stateManager.getCompletionGrid();
        populateSampleSelectionScreen(sampleSelectionElement, sessionSetup.sampleAmount, (row, col) => this.startSample(row, col), completionGrid);
        this.showScreen('sample-selection-screen');
    }
    async startSample(row, col) {
        console.log(`Starting sample ${row}${col}`);
        // Set the title to the correct sample name.
        let sequence = document.getElementsByClassName('sample-name');
        let name = `${col} ${row + 1}`;
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
        this.stateManager.setSample(row, col, sample);
        let samples = this.stateManager.getSamples();
        if (this.stateManager.allSamplesCollected()) {
            console.log("All samples collected", samples);
            const setup = this.stateManager.getSetup();
            console.log("Generating Excel");
            generateAndDownloadCsv(setup, samples);
            this.reset();
            console.log("Excel generated and downloaded");
        }
        else {
            this.setupSampleSelection();
        }
    }
}
function awaitForm(form, handler) {
    console.log(`awaiting form ${form}`);
    return new Promise(resolve => {
        let formElement = clean_listeners(document.getElementById(form));
        formElement.addEventListener('submit', (e) => {
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
    SAMPLE_SIDES.forEach(side => {
        const label = document.createElement('div');
        label.className = 'col-label';
        label.textContent = side;
        grid.appendChild(label);
    });
    for (let i = 1; i <= sampleAmount; i++) {
        const label = document.createElement('div');
        label.className = 'row-label';
        label.textContent = i.toString();
        grid.appendChild(label);
        SAMPLE_SIDES.forEach(side => {
            const cell = document.createElement('div');
            cell.className = 'sample-cell';
            cell.textContent = `🌳`;
            if (completionGrid[i - 1][side]) {
                cell.classList.add('completed');
            }
            else {
                // this is fine as the grid is re-rendered every time. But it is fishy.
                cell.addEventListener('click', () => {
                    cell.classList.add('completed');
                    startSample(i - 1, side);
                }, { once: true });
            }
            grid.appendChild(cell);
        });
    }
    ;
}
function clean_listeners(element) {
    const clone = element.cloneNode(true);
    element.parentNode.replaceChild(clone, element);
    return clone;
}
