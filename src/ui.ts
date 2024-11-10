// ui.ts

export function showScreen(name: 'setup' | 'sampling') {
    const setupScreen = document.querySelector<HTMLElement>('[data-screen="setup"]');
    const samplingScreen = document.querySelector<HTMLElement>('[data-screen="sampling"]');
    
    if (!setupScreen || !samplingScreen) return;
    
    setupScreen.style.display = name === 'setup' ? 'block' : 'none';
    samplingScreen.style.display = name === 'sampling' ? 'block' : 'none';
}

export function updateCount(index: number, count: number) {
    const el = document.getElementById(`count-${index}`);
    if (el) el.textContent = count.toString();
}

export function downloadCsv(filename: string, content: string) {
    const blob = new Blob([content], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
}