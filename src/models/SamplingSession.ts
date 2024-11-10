import { bugTypes } from './BugTypes.js';
import { Location, SamplingData } from './types.js';

export class SamplingSession {
    public readonly name: string;
    private readonly duration: number;
    private readonly startTime: Date;
    // Note: only the reference is readonly, array contents can still be modified
    public readonly counts: number[];
    private readonly actions: number[];
    private location: Location | null;

    constructor(name: string, duration: number) {
        this.name = name;
        this.duration = duration;
        this.startTime = new Date();
        this.counts = new Array(bugTypes.length).fill(0);
        this.actions = [];
        this.location = null;
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    this.location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                },
                (error: GeolocationPositionError) => console.error("Error getting location:", error)
            );
        }
    }

    incrementBug(index: number): number {
        this.counts[index]++;
        this.actions.push(index);
        return this.counts[index];
    }

    undo(): number | null {
        if (this.actions.length > 0) {
            const lastIndex = this.actions.pop()!;
            this.counts[lastIndex]--;
            return lastIndex;
        }
        return null;
    }

    generateReport(): string {
        const data: SamplingData = {
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