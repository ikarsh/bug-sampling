export class LocationTracker {
    watchId = null;
    currentLocation = 'N/A';
    updateLocationInput(s, spn) {
        let locationInput = document.getElementById('location');
        locationInput.value = s;
        let statusSpan = document.getElementById('locationStatus');
        statusSpan.textContent = spn;
    }
    constructor() {
        this.initializeLocation();
        this.startTracking();
    }
    initializeLocation() {
        this.updateLocationInput('N/A', '(No location available)');
    }
    startTracking() {
        if (!('geolocation' in navigator)) {
            this.updateLocationInput('N/A', '(Geolocation not supported)');
            return;
        }
        this.watchId = navigator.geolocation.watchPosition(this.handleSuccess.bind(this), this.handleError.bind(this), { timeout: 5000 });
    }
    handleSuccess(position) {
        this.currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        this.updateLocationInput(`${this.currentLocation.latitude.toFixed(6)}, ${this.currentLocation.longitude.toFixed(6)}`, '✓');
    }
    handleError(error) {
        this.currentLocation = 'N/A';
        this.updateLocationInput('N/A', '(Error getting location)');
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
