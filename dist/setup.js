// setup.ts
import { SITES, SAMPLING_TYPES } from './types.js';
export class SetupHandler {
    constructor() {
        this.locationWatchId = null;
        this.initializeForm();
        this.startLocationTracking();
    }
    initializeForm() {
        // Set current date and time
        const now = new Date();
        const dateInput = document.getElementById('samplingDate');
        const hourInput = document.getElementById('samplingHour');
        dateInput.value = now.toLocaleDateString();
        hourInput.value = now.toLocaleTimeString();
        // Populate dropdowns
        const siteSelect = document.getElementById('site');
        const typeSelect = document.getElementById('type');
        SITES.forEach(site => {
            const option = document.createElement('option');
            option.value = site;
            option.textContent = site;
            siteSelect.appendChild(option);
        });
        SAMPLING_TYPES.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeSelect.appendChild(option);
        });
    }
    startLocationTracking() {
        if ('geolocation' in navigator) {
            const locationInput = document.getElementById('location');
            const statusSpan = document.getElementById('locationStatus');
            this.locationWatchId = navigator.geolocation.watchPosition((position) => {
                const { latitude, longitude } = position.coords;
                locationInput.value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                statusSpan.textContent = '✓';
            }, (error) => {
                statusSpan.textContent = `(Error: ${error.message})`;
            });
        }
    }
    getCurrentSetup() {
        return {
            date: document.getElementById('samplingDate').value,
            hour: document.getElementById('samplingHour').value,
            location: document.getElementById('location').value,
            site: document.getElementById('site').value,
            type: document.getElementById('type').value,
            samplingLength: parseInt(document.getElementById('samplingLength').value)
        };
    }
    cleanup() {
        if (this.locationWatchId !== null) {
            navigator.geolocation.clearWatch(this.locationWatchId);
        }
    }
}
