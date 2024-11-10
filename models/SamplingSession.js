import { bugTypes } from './BugTypes.js';
export class SamplingSession {
    constructor(name, duration) {
        this.name = name;
        this.duration = duration;
        this.startTime = new Date();
        this.counts = new Array(bugTypes.length).fill(0);
        this.actions = [];
        this.location = null;
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                },
                error => console.error("Error getting location:", error)
            );
        }
    }

    incrementBug(index) {
        this.counts[index]++;
        this.actions.push(index);
        return this.counts[index];
    }

    undo() {
        if (this.actions.length > 0) {
            const lastIndex = this.actions.pop();
            this.counts[lastIndex]--;
            return lastIndex;
        }
        return null;
    }

    generateReport() {
        const data = {
            name: this.name,
            startTime: this.startTime.toISOString(),
            duration: this.duration,
            location: this.location,
            counts: bugTypes.map((bug, index) => ({
                bugType: bug.name,
                count: this.counts[index]
            }))
        };

        let csv = "Sampling Name,Start Time,Duration (s),Latitude,Longitude\n";
        csv += `${data.name},${data.startTime},${data.duration},`;
        csv += `${data.location ? data.location.latitude : 'N/A'},`;
        csv += `${data.location ? data.location.longitude : 'N/A'}\n\n`;
        
        csv += "Bug Type,Count\n";
        data.counts.forEach(row => {
            csv += `${row.bugType},${row.count}\n`;
        });

        return csv;
    }
}