import { BugDisplay } from "./bugDisplay.js";
import { bugs } from "./bugs.js";
import { SetupHandler } from "./setup.js";
import { SamplingSetup, Sample } from "./types.js";
import { UiState } from "./ui.js";

// just copied main

let currentDisplay: BugDisplay | null = null;
const setupHandler = new SetupHandler();
const ui = new UiState();

let setup = null; // The answers to the initial form.

document.getElementById('undoButton')?.addEventListener('click', () => {
    console.log("undo clicked");
    currentDisplay?.undo();
});
let samples: Sample[] = [];

// Setup initial form submission
document.getElementById('initialForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("initial form submitted");
    setup = setupHandler.getCurrentSetup();
    samples = [];
    console.log("showing sample form");
    ui.showScreen('sample-form-screen');
});

// sample form submission
document.getElementById('sampleForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log("secondary form submitted");
    
    const phenologicalState = parseInt((document.getElementById('PhenologicalState') as HTMLInputElement).value);
    const femaleFlowerPercentage = parseInt((document.getElementById('FemaleFlowerPercentage') as HTMLInputElement).value);

    // sampling phase
    const gridElement = document.getElementById('bugGrid')!;
    currentDisplay = new BugDisplay(gridElement);
    ui.showScreen('sample-screen');
    
    // wait for timer to finish
    const setup = setupHandler.getCurrentSetup();
    await ui.startTimer(setup.samplingLength);
    
    // store sample results
    if (currentDisplay) {
        samples.push({
            phenologicalState,
            femaleFlowerPercentage,
            counts: currentDisplay.getCounts(),
        });
        currentDisplay = null;
        
        if (samples.length < 2) {
            ui.showScreen('sample-form-screen');  // do another sample
        } else {
            // all done!
            ui.downloadCsv('bugs.csv', generateFullCsv(setupHandler.getCurrentSetup(), samples));
            samples = [];
            ui.showScreen('session-form-screen');
        }
    }
});

function generateFullCsv(setup: SamplingSetup, samples: Sample[]): string {
    const setupInfo = `Date,${setup.date}\nLocation,${setup.location}\nSite,${setup.site}\nType,${setup.treatment}\nLength,${setup.samplingLength}\n\n`;
    
    const sampleCsv = samples.map((sub, idx) => 
        `Sample ${idx + 1}\nPhenological State,${sub.phenologicalState}\nFemale Flower Percentage,${sub.femaleFlowerPercentage}\n${bugs.map((bug, i) => 
            `${bug.name},${sub.counts[i]}`
        ).join('\n')}\n`
    ).join('\n');

    return setupInfo + sampleCsv;
}