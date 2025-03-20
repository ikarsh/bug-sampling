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
export async function generateAndDownloadCsv(setup: SessionSetup, samples: Record<SampleSide, Sample>[]) {
    const headers = [
        'Time', 'Location', 'Site', 'Treatment', 
        'Sample Number', 'Sample Side',
        'Phenological State', 'Female Flower %',
        ...bugs.map(bug => bug.name),
        'Comments'
    ].join(',');
    const rows: string[] = [];
    samples.forEach((treeSamples, treeIndex) => {
        Object.entries(treeSamples).forEach(([side, sample]) => {
            // Format the location properly for CSV
            const locationValue = setup.location === 'N/A'
                ? setup.location
                : `${setup.location.latitude}, ${setup.location.longitude}`;
                
            const rowValues = [
                setup.date.toLocaleString(),
                locationValue,  // This is our location field which may contain a comma
                setup.site,
                setup.treatment,
                treeIndex + 1,
                side,
                sample.phenologicalState,
                sample.femaleFlowerPercentage,
                ...sample.counts,
                sample.comments
            ];
            
            // Properly escape each field for CSV
            const escapedRow = rowValues.map(value => {
                // Convert to string if not already
                const strValue = String(value);
                
                // If value contains comma, quotes, or newlines, wrap in quotes and escape any quotes
                if (strValue.includes(',') || strValue.includes('"') || strValue.includes('\n')) {
                    return `"${strValue.replace(/"/g, '""')}"`;
                }
                return strValue;
            }).join(',');
            
            rows.push(escapedRow);
        });
    });

    // Combine into CSV with UTF-8 BOM
    const BOM = '\uFEFF';  // UTF-8 BOM for Excel compatibility
    const csv = BOM + [headers, ...rows].join('\n');
    
    // Create blob
    const blob = new Blob([new TextEncoder().encode(csv)], { type: 'text/csv;charset=utf-8' });
    const filename = `bugs_${setup.site}_${setup.treatment}_${new Date().toISOString().split('T')[0]}.csv`;
    // seems we can't set file names for the download in ios. ridiculus
    const url = URL.createObjectURL(blob);
    if (confirm('CLICK DOWNLOAD NOW TO NOT LOSE THE FILE!')) {
        window.open(url, '_blank');
    }


    //     // Check if we're on iOS
    //     const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
    //     if (isIOS) {
    //         alert('CSV is ready! It will open in a new tab. Use the share button to save it.');
    //         window.open(url, '_blank');
    //         // Give the browser time to open the tab before cleaning up
    //         setTimeout(() => URL.revokeObjectURL(url), 1000);
    //     } else {
    //         // On desktop/android, use traditional download
    //         const a = document.createElement('a');
    //         a.href = url;
    //         a.download = `bugs_${setup.site}_${setup.treatment}_${new Date().toISOString().split('T')[0]}.csv`;
    //         a.click();
    //         alert('CSV download started!');
    //         // Cleanup after giving time for the download to start
    //         setTimeout(() => URL.revokeObjectURL(url), 1000);
    //     }
    // } catch (error) {
    //     console.error('Failed to generate CSV:', error);
    //     alert('Failed to generate CSV file.');
    // }
}