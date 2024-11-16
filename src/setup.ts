// setup.ts
import { SamplingSetup, SITES, SAMPLING_TYPES } from './types.js';

export class SetupHandler {
    private locationWatchId: number | null = null;

    constructor() {
        this.initializeForm();
        this.startLocationTracking();
    }

    private initializeForm() {
        // Set current date and time
        const now = new Date();
        const dateInput = document.getElementById('samplingDate') as HTMLInputElement;
        const hourInput = document.getElementById('samplingHour') as HTMLInputElement;
        
        dateInput.value = now.toLocaleDateString();
        hourInput.value = now.toLocaleTimeString();

        // Populate dropdowns
        const siteSelect = document.getElementById('site') as HTMLSelectElement;
        const typeSelect = document.getElementById('type') as HTMLSelectElement;

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

    private startLocationTracking() {
        if ('geolocation' in navigator) {
            const locationInput = document.getElementById('location') as HTMLInputElement;
            const statusSpan = document.getElementById('locationStatus') as HTMLSpanElement;

            this.locationWatchId = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    locationInput.value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                    statusSpan.textContent = '✓';
                },
                (error) => {
                    statusSpan.textContent = `(Error: ${error.message})`;
                }
            );
        }
    }

    public getCurrentSetup(): SamplingSetup {
        return {
            date: (document.getElementById('samplingDate') as HTMLInputElement).value,
            hour: (document.getElementById('samplingHour') as HTMLInputElement).value,
            location: (document.getElementById('location') as HTMLInputElement).value,
            site: (document.getElementById('site') as HTMLSelectElement).value as SamplingSetup['site'],
            type: (document.getElementById('type') as HTMLSelectElement).value as SamplingSetup['type'],
            samplingLength: parseInt((document.getElementById('samplingLength') as HTMLInputElement).value)
        };
    }

    public cleanup() {
        if (this.locationWatchId !== null) {
            navigator.geolocation.clearWatch(this.locationWatchId);
        }
    }
}   