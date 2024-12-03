import { Location, Coordinates } from './types.js';

export class LocationTracker {
    private watchId: number | null = null;
    private currentLocation: Location = 'N/A';
    private locationInput: HTMLInputElement;
    private statusSpan: HTMLSpanElement;

    constructor() {
        this.locationInput = document.getElementById('location') as HTMLInputElement;
        this.statusSpan = document.getElementById('locationStatus') as HTMLSpanElement;
        this.initializeLocation();
        this.startTracking();
    }

    private initializeLocation() {
        this.locationInput.value = 'N/A';
        this.statusSpan.textContent = '(No location available)';
    }

    private startTracking() {
        if (!('geolocation' in navigator)) {
            this.statusSpan.textContent = '(Geolocation not supported)';
            return;
        }

        this.watchId = navigator.geolocation.watchPosition(
            this.handleSuccess.bind(this),
            this.handleError.bind(this),
            { timeout: 5000 }
        );
    }

    private handleSuccess(position: GeolocationPosition) {
        this.currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        this.locationInput.value = `${this.currentLocation.latitude.toFixed(6)}, ${this.currentLocation.longitude.toFixed(6)}`;
        this.statusSpan.textContent = '✓';
    }

    private handleError(error: GeolocationPositionError) {
        this.currentLocation = 'N/A';
        this.locationInput.value = 'N/A';
        this.statusSpan.textContent = `(No location available)`;
    }

    public getCurrentLocation(): Location {
        return this.currentLocation;
    }

    public cleanup() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
        }
    }
}