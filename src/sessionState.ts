import { SAMPLE_SIDES } from "./config.js";
import { Sample, SessionSetup, SampleSide } from "./types.js";
import { Screen } from "./screenManager.js";

const STATE_KEY = 'sampling_session_state';

interface SessionState {
    setup: SessionSetup | null;
    samples: Record<SampleSide, Sample | null>[] | null;
    currentScreen: Screen;
}

export class SessionStateManager {
    private state: SessionState;

    constructor() {
        const savedState = localStorage.getItem(STATE_KEY);
        if (savedState) {
            const parsed = JSON.parse(savedState);
            // if (parsed.setup) {
            //     parsed.setup.date = new Date(parsed.setup.date);
            // } # Not sure I want this..
            // TODO maybe make it delete everything if too much time passed.
            this.state = parsed;
        } else {
            this.state = {
                setup: null,
                samples: null,
                currentScreen: 'session-form-screen'
            };
        }
    }

    private save() {
        localStorage.setItem(STATE_KEY, JSON.stringify(this.state));
    }

    getSetup(): SessionSetup | null {
        return this.state.setup;
    }

    setSetup(setup: SessionSetup) {
        this.state.setup = setup;
        this.state.samples = Array(setup.sampleAmount).fill(null).map(() => 
            Object.fromEntries(SAMPLE_SIDES.map(side => [side, null]))
        );
        this.save();
    }

    getSamples(): Record<SampleSide, Sample | null>[] | null {
        return this.state.samples;
    }

    getCompletionGrid(): Record<SampleSide, Sample | boolean>[] | null {
        if (!this.state.samples) {
            return null;
        }
        return this.state.samples.map(tree => 
            Object.fromEntries(
                SAMPLE_SIDES.map(side => [side, tree[side] !== null])
            ) as Record<SampleSide, boolean>
        );
    }

    setSample(treeIndex: number, side: SampleSide, sample: Sample) {
        this.state.samples![treeIndex][side] = sample;
        this.save();
    }

    getCurrentScreen(): Screen {
        return this.state.currentScreen;
    }

    setCurrentScreen(screen: Screen) {
        this.state.currentScreen = screen;
        this.save();
    }

    allSamplesCollected(): boolean {
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