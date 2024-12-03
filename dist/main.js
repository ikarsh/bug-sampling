var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c;
import { BugDisplay } from "./bugDisplay.js";
import { bugs } from "./bugs.js";
import { SetupHandler } from "./setup.js";
import { UiState } from "./ui.js";
let currentDisplay = null;
const setupHandler = new SetupHandler();
const ui = new UiState();
let setup = null; // The answers to the initial form.
(_a = document.getElementById('undoButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    console.log("undo clicked");
    currentDisplay === null || currentDisplay === void 0 ? void 0 : currentDisplay.undo();
});
let subsessions = [];
// Setup initial form submission
(_b = document.getElementById('initialForm')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    console.log("initial form submitted");
    setup = setupHandler.getCurrentSetup();
    subsessions = [];
    console.log("showing subsession form");
    ui.showScreen('subsession-form');
}));
// subsession form submission
(_c = document.getElementById('subsessionForm')) === null || _c === void 0 ? void 0 : _c.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    console.log("secondary form submitted");
    const phenologicalState = parseInt(document.getElementById('PhenologicalState').value);
    const femaleFlowerPercentage = parseInt(document.getElementById('FemaleFlowerPercentage').value);
    // sampling phase
    const gridElement = document.getElementById('bugGrid');
    currentDisplay = new BugDisplay(gridElement);
    ui.showScreen('sampling');
    // wait for timer to finish
    const setup = setupHandler.getCurrentSetup();
    yield ui.startTimer(setup.samplingLength);
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
            ui.showScreen('subsession-form'); // do another subsession
        }
        else {
            // all done!
            ui.downloadCsv('bugs.csv', generateFullCsv(setupHandler.getCurrentSetup(), subsessions));
            subsessions = [];
            ui.showScreen('setup');
        }
    }
}));
function generateFullCsv(setup, subsessions) {
    const setupInfo = `Date,${setup.date}\nLocation,${setup.location}\nSite,${setup.site}\nType,${setup.treatment}\nLength,${setup.samplingLength}\n\n`;
    const subsessionsCsv = subsessions.map((sub, idx) => `Subsession ${idx + 1}\nPhenological State,${sub.phenologicalState}\nFemale Flower Percentage,${sub.femaleFlowerPercentage}\n${bugs.map((bug, i) => `${bug.name},${sub.counts[i]}`).join('\n')}\n`).join('\n');
    return setupInfo + subsessionsCsv;
}
