import { SamplingSetup, SITES, TREATMENTS, Treatment } from './types.js';
import { LocationTracker } from './locationTracker.js';

export class SetupHandler {
    private locationTracker: LocationTracker;

    constructor() {
        this.locationTracker = new LocationTracker();
        this.initializeForm();
    }

    private initializeForm() {
        this.initializeDateAndTime();
        this.populateDropdowns();
    }

    private initializeDateAndTime() {
        const now = new Date();
        const dateInput = document.getElementById('samplingDate') as HTMLInputElement;
        const hourInput = document.getElementById('samplingHour') as HTMLInputElement;
        
        dateInput.value = now.toLocaleDateString();
        hourInput.value = now.toLocaleTimeString();

        setInterval(() => {
            hourInput.value = new Date().toLocaleTimeString();
        }, 1000);
    }

    private populateDropdowns() {
        const siteSelect = document.getElementById('site') as HTMLSelectElement;
        const treatmentSelect = document.getElementById('treatment') as HTMLSelectElement;

        SITES.forEach(site => {
            const option = document.createElement('option');
            option.value = site;
            option.textContent = site;
            siteSelect.appendChild(option);
        });

        TREATMENTS.forEach(treatment => {
            const option = document.createElement('option');
            option.value = treatment;
            option.textContent = treatment;
            treatmentSelect.appendChild(option);
        });
    }

    public getCurrentSetup(): SamplingSetup {
        return {
            date: new Date(),
            location: this.locationTracker.getCurrentLocation(),
            site: (document.getElementById('site') as HTMLSelectElement).value as SamplingSetup['site'],
            treatment: (document.getElementById('treatment') as HTMLSelectElement).value as Treatment,
            samplingLength: parseInt((document.getElementById('samplingLength') as HTMLInputElement).value)
        };
    }

    public cleanup() {
        this.locationTracker.cleanup();
    }
}