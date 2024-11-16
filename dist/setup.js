// setup.ts
import { SITES, SAMPLING_TYPES } from './types.js';
export class SetupHandler {
    constructor() {
        this.locationWatchId = null;
        this.currentLocation = 'N/A';
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
        // Initialize location as N/A
        const locationInput = document.getElementById('location');
        const statusSpan = document.getElementById('locationStatus');
        locationInput.value = 'N/A';
        statusSpan.textContent = '(No location available)';
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
        // Update time every second
        setInterval(() => {
            const now = new Date();
            hourInput.value = now.toLocaleTimeString();
        }, 1000);
    }
    startLocationTracking() {
        if ('geolocation' in navigator) {
            const locationInput = document.getElementById('location');
            const statusSpan = document.getElementById('locationStatus');
            this.locationWatchId = navigator.geolocation.watchPosition((position) => {
                this.currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                locationInput.value = `${this.currentLocation.latitude.toFixed(6)}, ${this.currentLocation.longitude.toFixed(6)}`;
                statusSpan.textContent = '✓';
            }, (error) => {
                this.currentLocation = 'N/A';
                locationInput.value = 'N/A';
                statusSpan.textContent = `(No location available)`;
            }, { timeout: 5000 } // Add a reasonable timeout
            );
        }
        else {
            // Browser doesn't support geolocation
            const locationInput = document.getElementById('location');
            const statusSpan = document.getElementById('locationStatus');
            locationInput.value = 'N/A';
            statusSpan.textContent = '(Geolocation not supported)';
        }
    }
    getCurrentSetup() {
        return {
            date: new Date(),
            location: this.currentLocation,
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
