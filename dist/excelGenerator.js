import { bugs } from './config.js';
export function generateAndDownloadCsv(setup, samples) {
    // Create headers
    const headers = [
        'Time', 'Location', 'Site', 'Treatment',
        'Sample Number', 'Sample Side',
        'Phenological State', 'Female Flower %',
        ...bugs.map(bug => bug.name),
        'Comments'
    ].join(',');
    // Create rows
    const rows = [];
    samples.forEach((treeSamples, treeIndex) => {
        Object.entries(treeSamples).forEach(([side, sample]) => {
            if (!sample)
                return;
            const location = typeof setup.location === 'string'
                ? setup.location
                : `${setup.location.latitude}, ${setup.location.longitude}`;
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
    // Combine into CSV
    const csv = [headers, ...rows].join('\n');
    // Create and download
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `bugs_${setup.site}_${setup.treatment}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
}
