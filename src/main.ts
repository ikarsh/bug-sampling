import { BugDisplay } from "./bugDisplay.js";
import { bugs } from "./bugs.js";
import { SessionFormHandler } from "./sessionFormHandler.js";
import { timer } from "./timer.js";
import { SessionSetup, Sample } from "./types.js";
import { UiState } from "./ui.js";

let currentDisplay: BugDisplay | null = null;
const setupHandler = new SessionFormHandler();
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
    setup = setupHandler.getSetup();
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
    const setup = setupHandler.getSetup();
    await timer(document.getElementById('timer')!, setup.samplingLength);
    
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
            ui.downloadCsv('bugs.csv', generateFullCsv(setupHandler.getSetup(), samples));
            samples = [];
            ui.showScreen('session-form-screen');
        }
    }
});

function generateFullCsv(setup: SessionSetup, samples: Sample[]): string {
    const setupInfo = `Date,${setup.date}\nLocation,${setup.location}\nSite,${setup.site}\nType,${setup.treatment}\nLength,${setup.samplingLength}\n\n`;
    
    const sampleCsv = samples.map((sample, idx) => 
        `Sample ${idx + 1}\nPhenological State,${sample.phenologicalState}\nFemale Flower Percentage,${sample.femaleFlowerPercentage}\n${bugs.map((bug, i) => 
            `${bug.name},${sample.counts[i]}`
        ).join('\n')}\n`
    ).join('\n');

    return setupInfo + sampleCsv;
}