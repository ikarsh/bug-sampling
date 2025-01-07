import { Location, Coordinates } from '../types.js';

export class LocationTracker {
    private watchId: number | null = null;
    private currentLocation: Location = 'N/A';

    updateLocationInput(s: string, spn: string) {
        let locationInput = document.getElementById('location') as HTMLInputElement;
        locationInput.value = s;
        let statusSpan = document.getElementById('locationStatus') as HTMLSpanElement;
        statusSpan.textContent = spn;
    }

    constructor() {
        this.initializeLocation();
        this.startTracking();
    }

    private initializeLocation() {
        this.updateLocationInput('N/A', '(No location available)');
    }

    private startTracking() {
        if (!('geolocation' in navigator)) {
            this.updateLocationInput('N/A', '(Geolocation not supported)');
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
        this.updateLocationInput(`${this.currentLocation.latitude.toFixed(6)}, ${this.currentLocation.longitude.toFixed(6)}`, '✓');
    }

    private handleError(error: GeolocationPositionError) {
        this.currentLocation = 'N/A';
        this.updateLocationInput('N/A', '(Error getting location)');
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