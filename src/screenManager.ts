import { BugDisplay } from "./bugDisplay.js";
import { SAMPLE_SIDES } from "./config.js";
import { generateAndDownloadCsv } from "./csvGenerator.js";
import { SessionStateManager } from "./sessionState.js";
import { Sample, SampleSide, SessionSetup, Treatment } from "./types.js";
import { LocationTracker } from "./utils/locationTracker.js";
import { timer } from "./utils/timer.js";

export type Screen = 'session-form-screen' | 'sample-selection-screen' | 'sample-form-screen' | 'sample-screen' | 'comments-screen';

export class ScreenManager {
    private currentScreen: Screen;
    private screens: Map<Screen, HTMLElement>;
    private bugDisplay: BugDisplay;
    private stateManager: SessionStateManager;
    
    constructor() {
        this.stateManager = new SessionStateManager();
        this.bugDisplay = new BugDisplay(document.getElementById('bugGrid')!);
        
        this.screens = new Map();
        this.initialize_screens();
        this.currentScreen = this.stateManager.getCurrentScreen() as Screen;

        this.initializeButtons();

        // If we have existing session setup, skip to sample selection
        const existingSetup = this.stateManager.getSetup();
        if (existingSetup) {
            this.setupSampleSelection();
        } else {
            this.selectSessionSetup();
        }
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
            curr.style.display = show ? 'block' : 'none';
        }
        else {
            console.error(`Screen ${this.currentScreen} not found`);
        }
    }

    showScreen(name: Screen) {
        console.log(`showing screen ${name}`);
        this.toggleScreen(false);
        this.currentScreen = name;
        this.stateManager.setCurrentScreen(name);
        this.toggleScreen(true);
    }

    // event handling

    private initializeButtons() {
        // undo button
        let undoButton = clean_listeners(document.getElementById('undoButton')!);
        undoButton.addEventListener('click', () => {
            console.log("undo clicked");
            this.bugDisplay?.undo();
        });

        // reset button
        let resetButton = clean_listeners(document.getElementById('resetButton')!);
        resetButton.addEventListener('click', () => {
            if (confirm('Are you sure? This will delete all collected data.')) {
                this.reset();
            }
        });
    }

    private reset() {
        this.stateManager.clearSession();
        window.location.reload();
    }

    private async selectSessionSetup() {
        this.showScreen('session-form-screen');
        let locationTracker = new LocationTracker();
        const sessionSetup = await awaitForm('sessionForm', () => {
            console.log("session form submitted");
            return {
                date: new Date(),
                location: locationTracker.getCurrentLocation(),
                site: (document.getElementById('site') as HTMLSelectElement).value as SessionSetup['site'],
                treatment: (document.getElementById('treatment') as HTMLSelectElement).value as Treatment,
                sampleAmount: parseInt((document.getElementById('treeAmount') as HTMLInputElement).value),
            } as SessionSetup;
        });
        console.log("Got session setup", sessionSetup);

        this.stateManager.setSetup(sessionSetup);
        this.setupSampleSelection();
    }

    private setupSampleSelection() {
        const sessionSetup = this.stateManager.getSetup()!;

        let sampleSelectionTitle = document.getElementById('sample-selection-title')!;
        sampleSelectionTitle.textContent = `${sessionSetup.site}, ${sessionSetup.treatment}`;

        // This could be more efficient but it's fine.
        let sampleSelectionElement = document.getElementById('sample-selection-grid')!;
        const completionGrid = this.stateManager.getCompletionGrid()!;
        
        populateSampleSelectionScreen(
            sampleSelectionElement, 
            sessionSetup.sampleAmount, 
            (row, col) => this.startSample(row, col),
            completionGrid
        );
        this.showScreen('sample-selection-screen');
    }

    private async startSample(row: number, col: SampleSide) {
        console.log(`Starting sample ${row}${col}`);

        // Set the title to the correct sample name.
        let sequence = document.getElementsByClassName('sample-name')
        let name = `${col} ${row}`;
        Array.from(sequence).forEach(e => (e as HTMLElement).textContent = name);

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

        this.bugDisplay = new BugDisplay(document.getElementById('bugGrid')!);
        this.showScreen('sample-screen');
        // wait for timer to finish
        console.log(`Starting timer for ${sample_setup.samplingLength} seconds`);
        await timer(document.getElementById('timer')!, sample_setup.samplingLength);

        // clear previous comments
        (document.getElementById('comments') as HTMLTextAreaElement).value = '';
        
        this.showScreen('comments-screen');
        const comments = await awaitForm('commentsForm', () => {
            return (document.getElementById('comments') as HTMLTextAreaElement).value;
        });


        // store sample results
        const sample = {
            phenologicalState: sample_setup.phenologicalState,
            femaleFlowerPercentage: sample_setup.femaleFlowerPercentage,
            samplingLength: sample_setup.samplingLength,
            counts: this.bugDisplay.getCounts(),
            comments,
        } as Sample;

        this.stateManager.setSample(row - 1, col, sample);
        let samples = this.stateManager.getSamples();
        if (this.stateManager.allSamplesCollected()) {
            console.log("All samples collected", samples);
            const setup = this.stateManager.getSetup()!;
            console.log("Generating Excel");
            generateAndDownloadCsv(setup, samples as Record<SampleSide, Sample>[]);
            this.reset();
            console.log("Excel generated and downloaded");
        } else {
            this.setupSampleSelection();
        }
    }
}

function awaitForm<T>(form: string, handler: () => T): Promise<T> {
    console.log(`awaiting form ${form}`);
    return new Promise(resolve => {
        let formElement = clean_listeners(document.getElementById(form)!);
        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            resolve(handler());
        }, { once: true });
    });
}

function populateSampleSelectionScreen(
    grid: HTMLElement, 
    sampleAmount: number, 
    startSample: (row: number, col: SampleSide) => void,
    completionGrid: Record<SampleSide, Sample | boolean>[]
) {
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
            } else {
                // this is fine as the grid is re-rendered every time. But it is fishy.
                cell.addEventListener('click', () => {
                    cell.classList.add('completed');
                    startSample(i - 1, side);
                }, { once: true });
            }
            grid.appendChild(cell);
        });
    };
}

function clean_listeners(element: HTMLElement) {
    const clone = element.cloneNode(true);
    element.parentNode!.replaceChild(clone, element);
    return clone as HTMLElement;
}