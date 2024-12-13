export class LocationTracker {
    watchId = null;
    currentLocation = 'N/A';
    locationInput;
    statusSpan;
    constructor() {
        this.locationInput = document.getElementById('location');
        this.statusSpan = document.getElementById('locationStatus');
        this.initializeLocation();
        this.startTracking();
    }
    initializeLocation() {
        this.locationInput.value = 'N/A';
        this.statusSpan.textContent = '(No location available)';
    }
    startTracking() {
        if (!('geolocation' in navigator)) {
            this.statusSpan.textContent = '(Geolocation not supported)';
            return;
        }
        this.watchId = navigator.geolocation.watchPosition(this.handleSuccess.bind(this), this.handleError.bind(this), { timeout: 5000 });
    }
    handleSuccess(position) {
        this.currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        this.locationInput.value = `${this.currentLocation.latitude.toFixed(6)}, ${this.currentLocation.longitude.toFixed(6)}`;
        this.statusSpan.textContent = '✓';
    }
    handleError(error) {
        this.currentLocation = 'N/A';
        this.locationInput.value = 'N/A';
        this.statusSpan.textContent = `(No location available)`;
    }
    getCurrentLocation() {
        return this.currentLocation;
    }
    cleanup() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
        }
    }
}
