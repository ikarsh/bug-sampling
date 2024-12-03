import { BugDisplay } from "./bugDisplay.js";
import { bugs } from "./bugs.js";
import { SetupHandler } from "./setup.js";
import { SamplingSetup, SubSession } from "./types.js";
import { UiState } from "./ui.js";

let currentDisplay: BugDisplay | null = null;
const setupHandler = new SetupHandler();
const ui = new UiState();

let setup = null; // The answers to the initial form.

document.getElementById('undoButton')?.addEventListener('click', () => {
    console.log("undo clicked");
    currentDisplay?.undo();
});
let subsessions: SubSession[] = [];

// Setup initial form submission
document.getElementById('initialForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log("initial form submitted");
    setup = setupHandler.getCurrentSetup();
    subsessions = [];
    console.log("showing subsession form");
    ui.showScreen('subsession-form');
});

// subsession form submission
document.getElementById('subsessionForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log("secondary form submitted");
    
    const phenologicalState = parseInt((document.getElementById('PhenologicalState') as HTMLInputElement).value);
    const femaleFlowerPercentage = parseInt((document.getElementById('FemaleFlowerPercentage') as HTMLInputElement).value);

    // sampling phase
    const gridElement = document.getElementById('bugGrid')!;
    currentDisplay = new BugDisplay(gridElement);
    ui.showScreen('sampling');
    
    // wait for timer to finish
    const setup = setupHandler.getCurrentSetup();
    await ui.startTimer(setup.samplingLength);
    
    // store subsession results
    if (currentDisplay) {
        subsessions.push({
            phenologicalState,
            femaleFlowerPercentage,
            counts: currentDisplay.getCounts(),
            actions: currentDisplay.getActions()
        });
        currentDisplay = null;
        
        if (subsessions.length < 2) {
            ui.showScreen('subsession-form');  // do another subsession
        } else {
            // all done!
            ui.downloadCsv('bugs.csv', generateFullCsv(setupHandler.getCurrentSetup(), subsessions));
            subsessions = [];
            ui.showScreen('setup');
        }
    }
});

function generateFullCsv(setup: SamplingSetup, subsessions: SubSession[]): string {
    const setupInfo = `Date,${setup.date}\nLocation,${setup.location}\nSite,${setup.site}\nType,${setup.treatment}\nLength,${setup.samplingLength}\n\n`;
    
    const subsessionsCsv = subsessions.map((sub, idx) => 
        `Subsession ${idx + 1}\nPhenological State,${sub.phenologicalState}\nFemale Flower Percentage,${sub.femaleFlowerPercentage}\n${bugs.map((bug, i) => 
            `${bug.name},${sub.counts[i]}`
        ).join('\n')}\n`
    ).join('\n');

    return setupInfo + subsessionsCsv;
}