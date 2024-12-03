import { SITES, TREATMENTS } from './types.js';
import { LocationTracker } from './utils/locationTracker.js';
export class SessionFormHandler {
    constructor() {
        this.locationTracker = new LocationTracker();
        this.initializeForm();
    }
    initializeForm() {
        this.initializeDateAndTime();
        this.populateDropdowns();
    }
    initializeDateAndTime() {
        const dateInput = document.getElementById('samplingDate');
        const hourInput = document.getElementById('samplingHour');
        const updateDateTime = () => {
            const now = new Date();
            dateInput.value = now.toLocaleDateString();
            hourInput.value = now.toLocaleTimeString();
        };
        // set initial values
        updateDateTime();
        // update both every second
        setInterval(updateDateTime, 1000);
    }
    populateDropdowns() {
        const siteSelect = document.getElementById('site');
        const treatmentSelect = document.getElementById('treatment');
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
    getSetup() {
        return {
            date: new Date(),
            location: this.locationTracker.getCurrentLocation(),
            site: document.getElementById('site').value,
            treatment: document.getElementById('treatment').value,
            samplingLength: parseInt(document.getElementById('samplingLength').value)
        };
    }
    cleanup() {
        this.locationTracker.cleanup();
    }
}
