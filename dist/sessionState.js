import { SAMPLE_SIDES } from "./config.js";
const STATE_KEY = 'sampling_session_state';
export class SessionStateManager {
    state;
    constructor() {
        const savedState = localStorage.getItem(STATE_KEY);
        if (savedState) {
            const parsed = JSON.parse(savedState);
            // if (parsed.setup) {
            //     parsed.setup.date = new Date(parsed.setup.date);
            // } # Not sure I want this..
            // TODO maybe make it delete everything if too much time passed.
            this.state = parsed;
        }
        else {
            this.state = {
                setup: null,
                samples: null,
                currentScreen: 'session-form-screen'
            };
        }
    }
    save() {
        localStorage.setItem(STATE_KEY, JSON.stringify(this.state));
    }
    getSetup() {
        return this.state.setup;
    }
    setSetup(setup) {
        this.state.setup = setup;
        this.state.samples = Array(setup.sampleAmount).fill(null).map(() => Object.fromEntries(SAMPLE_SIDES.map(side => [side, null])));
        this.save();
    }
    getSamples() {
        return this.state.samples;
    }
    getCompletionGrid() {
        if (!this.state.samples) {
            return null;
        }
        return this.state.samples.map(tree => Object.fromEntries(SAMPLE_SIDES.map(side => [side, tree[side] !== null])));
    }
    setSample(treeIndex, side, sample) {
        this.state.samples[treeIndex][side] = sample;
        this.save();
    }
    getCurrentScreen() {
        return this.state.currentScreen;
    }
    setCurrentScreen(screen) {
        this.state.currentScreen = screen;
        this.save();
    }
    allSamplesCollected() {
        if (!this.state.samples) {
            return false;
        }
        return this.state.samples.every(row => SAMPLE_SIDES.every(side => row[side] !== null));
    }
    clearSession() {
        localStorage.removeItem(STATE_KEY);
        this.state = {
            setup: null,
            samples: [],
            currentScreen: 'session-form-screen'
        };
    }
}
