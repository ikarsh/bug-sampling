// setup.ts
import { SamplingSetup, SITES, SAMPLING_TYPES, Coordinates, Location, SamplingType } from './types.js';

export class SetupHandler {
    private locationWatchId: number | null = null;
    private currentLocation: Location = 'N/A';

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

        // Initialize location as N/A
        const locationInput = document.getElementById('location') as HTMLInputElement;
        const statusSpan = document.getElementById('locationStatus') as HTMLSpanElement;
        locationInput.value = 'N/A';
        statusSpan.textContent = '(No location available)';

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

        // Update time every second
        setInterval(() => {
            const now = new Date();
            hourInput.value = now.toLocaleTimeString();
        }, 1000);
    }

    private startLocationTracking() {
        if ('geolocation' in navigator) {
            const locationInput = document.getElementById('location') as HTMLInputElement;
            const statusSpan = document.getElementById('locationStatus') as HTMLSpanElement;

            this.locationWatchId = navigator.geolocation.watchPosition(
                (position) => {
                    this.currentLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    locationInput.value = `${this.currentLocation.latitude.toFixed(6)}, ${this.currentLocation.longitude.toFixed(6)}`;
                    statusSpan.textContent = '✓';
                },
                (error) => {
                    this.currentLocation = 'N/A';
                    locationInput.value = 'N/A';
                    statusSpan.textContent = `(No location available)`;
                },
                { timeout: 5000 } // Add a reasonable timeout
            );
        } else {
            // Browser doesn't support geolocation
            const locationInput = document.getElementById('location') as HTMLInputElement;
            const statusSpan = document.getElementById('locationStatus') as HTMLSpanElement;
            locationInput.value = 'N/A';
            statusSpan.textContent = '(Geolocation not supported)';
        }
    }

    public getCurrentSetup(): SamplingSetup {
        return {
            date: new Date(),
            location: this.currentLocation,
            site: (document.getElementById('site') as HTMLSelectElement).value as SamplingSetup['site'],
            type: (document.getElementById('type') as HTMLSelectElement).value as SamplingType,
            samplingLength: parseInt((document.getElementById('samplingLength') as HTMLInputElement).value)
        };
    }

    public cleanup() {
        if (this.locationWatchId !== null) {
            navigator.geolocation.clearWatch(this.locationWatchId);
        }
    }
}