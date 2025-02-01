import { Sample, SessionSetup, SampleSide } from './types.js';
import { bugs } from './config.js';

/**
 * Generates a CSV file from the sampling data and initiates download.
 * On desktop: Downloads the file directly
 * On mobile: Opens the CSV in a new tab for the user to save
 * 
 * @param setup - Session setup information
 * @param samples - Collected sample data
 * @returns Promise that resolves when download is initiated
 */
export async function generateAndDownloadCsv(setup: SessionSetup, samples: Record<SampleSide, Sample>[]): Promise<void> {
    try {
        // Create headers
        const headers = [
            'Time', 'Location', 'Site', 'Treatment', 
            'Sample Number', 'Sample Side',
            'Phenological State', 'Female Flower %',
            ...bugs.map(bug => bug.name),
            'Comments'
        ].join(',');

        // Create rows
        const rows: string[] = [];
        samples.forEach((treeSamples, treeIndex) => {
            Object.entries(treeSamples).forEach(([side, sample]) => {
                const location = setup.location === 'N/A' 
                    ? setup.location 
                    : `"${setup.location.latitude}, ${setup.location.longitude}"`; // escape commas

                const row = [
                    setup.date.toLocaleString(),
                    location,
                    setup.site,
                    setup.treatment,
                    treeIndex + 1,
                    side,
                    sample.phenologicalState,
                    sample.femaleFlowerPercentage,
                    ...sample.counts,
                    sample.comments
                ].map(value => `"${value}"`).join(',');
                
                rows.push(row);
            });
        });

        // Combine into CSV with UTF-8 BOM
        const BOM = '\uFEFF';  // UTF-8 BOM for Excel compatibility
        const csv = BOM + [headers, ...rows].join('\n');
        
        // Create blob
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        // Check if we're on iOS
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        if (isIOS) {
            alert('CSV is ready! It will open in a new tab. Use the share button to save it.');
            window.open(url, '_blank');
            // Give the browser time to open the tab before cleaning up
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } else {
            // On desktop/android, use traditional download
            const a = document.createElement('a');
            a.href = url;
            a.download = `bugs_${setup.site}_${setup.treatment}_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            alert('CSV download started!');
            // Cleanup after giving time for the download to start
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
    } catch (error) {
        console.error('Failed to generate CSV:', error);
        alert('Failed to generate CSV file.');
    }
}