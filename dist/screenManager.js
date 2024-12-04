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
import { SAMPLE_SIDES } from "./config.js";
import { LocationTracker } from "./utils/locationTracker.js";
import { timer } from "./utils/timer.js";
export class ScreenManager {
    constructor() {
        this.currentScreen = 'session-form-screen';
        this.screens = new Map();
        this.bugDisplay = new BugDisplay(document.getElementById('bugGrid'));
        this.sessionSetup = null;
        this.samples = [];
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
        this.toggleScreen(true);
    }
    // event handling
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.toggleScreen(true);
            let locationTracker = new LocationTracker();
            // undo button
            (_a = document.getElementById('undoButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
                var _a;
                console.log("undo clicked");
                (_a = this.bugDisplay) === null || _a === void 0 ? void 0 : _a.undo();
            });
            this.sessionSetup = yield awaitForm('sessionForm', () => {
                console.log("session form submitted");
                return {
                    date: new Date(),
                    location: locationTracker.getCurrentLocation(),
                    site: document.getElementById('site').value,
                    treatment: document.getElementById('treatment').value,
                    sampleAmount: parseInt(document.getElementById('treeAmount').value),
                };
            });
            let sampleAmount = this.sessionSetup.sampleAmount;
            console.log("Got session setup", this.sessionSetup);
            // 2D array of samples, light side and dark side
            this.samples = Array.from({ length: sampleAmount }, () => [null, null]);
            // populate the sample selection screen
            let sampleSelectionElement = document.getElementById('sample-selection-grid');
            console.log("Got sample selection element", sampleSelectionElement);
            populateSampleSelectionScreen(sampleSelectionElement, sampleAmount, (row, col) => {
                this.startSample(row, col);
            });
            this.showScreen('sample-selection-screen');
        });
    }
    startSample(row, col) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Starting sample ${row}${col}`);
            // Set the title to the correct sample name.
            let sequence = document.getElementsByClassName('sample-name');
            console.log("sequence", sequence);
            let name = `Tree ${col}, ${row}`;
            Array.from(sequence).forEach(e => e.textContent = name);
            console.log("name", name);
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
            this.bugDisplay = new BugDisplay(document.getElementById('bugGrid'));
            this.showScreen('sample-screen');
            // wait for timer to finish
            console.log(`Starting timer for ${sample_setup.samplingLength} seconds`);
            yield timer(document.getElementById('timer'), sample_setup.samplingLength);
            // store sample results
            this.samples[col - 1][row === 'light' ? 0 : 1] = {
                phenologicalState: sample_setup.phenologicalState,
                femaleFlowerPercentage: sample_setup.femaleFlowerPercentage,
                counts: this.bugDisplay.getCounts(),
            };
            if (this.samples.every(row => row.every(sample => sample !== null))) {
                console.log("All samples collected", this.sessionSetup, this.samples);
                // this.downloadCsv('bugs.csv', this.generateFullCsv(session_setup, this.samples as Sample[][]));
                this.showScreen('session-form-screen');
            }
            else {
                this.showScreen('sample-selection-screen');
            }
        });
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
function populateSampleSelectionScreen(grid, sampleAmount, startSample) {
    // setup column labels
    const colLabels = document.createElement('div');
    colLabels.className = 'col-labels';
    Array.from({ length: sampleAmount }, (_, i) => i + 1).forEach(num => {
        const div = document.createElement('div');
        div.textContent = num.toString();
        colLabels.appendChild(div);
    });
    grid.appendChild(colLabels);
    // setup grid
    SAMPLE_SIDES.forEach((row, nrow) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'grid-row';
        const label = document.createElement('div');
        label.className = 'row-label';
        label.textContent = row;
        rowDiv.appendChild(label);
        const cellsDiv = document.createElement('div');
        cellsDiv.className = 'cells-grid';
        Array.from({ length: sampleAmount }, (_, i) => i + 1).forEach(col => {
            const cell = document.createElement('div');
            cell.className = 'sample-cell';
            cell.textContent = `${row}${col}`;
            cell.dataset.id = `${row}${col}`;
            cell.addEventListener('click', () => {
                console.log(`clicked ${row}${col}`);
                // Mark this square as done
                cell.classList.add('completed');
                startSample(row, col);
            }, { once: true });
            cellsDiv.appendChild(cell);
        });
        rowDiv.appendChild(cellsDiv);
        grid.appendChild(rowDiv);
    });
}
