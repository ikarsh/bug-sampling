var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
// main.ts
import { BugDisplay } from './bugDisplay.js';
import { SetupHandler } from './setup.js';
import { UiState } from './ui.js';
let currentDisplay = null;
const setupHandler = new SetupHandler();
const ui = new UiState();
// Setup undo button
(_a = document.getElementById('undoButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    currentDisplay === null || currentDisplay === void 0 ? void 0 : currentDisplay.undo();
});
// Setup form submission
(_b = document.getElementById('samplingForm')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
    e.preventDefault();
    const setup = setupHandler.getCurrentSetup();
    // Initialize new bug display
    const gridElement = document.getElementById('bugGrid');
    currentDisplay = new BugDisplay(gridElement);
    ui.showScreen('sampling');
    // wait for timer to finish
    yield ui.startTimer(setup.samplingLength);
    // handle completion
    if (currentDisplay) {
        ui.downloadCsv('bugs.csv', currentDisplay.generateCsv());
        currentDisplay = null;
        ui.showScreen('setup');
    }
}));
