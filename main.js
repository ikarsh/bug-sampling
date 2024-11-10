
// Bug data - in real app, this would come from a database
const bugTypes = [
    { name: "Ladybug", image: "/api/placeholder/60/60" },
    { name: "Butterfly", image: "/api/placeholder/60/60" },
    { name: "Ant", image: "/api/placeholder/60/60" },
    { name: "Beetle", image: "/api/placeholder/60/60" },
    { name: "Grasshopper", image: "/api/placeholder/60/60" },
    { name: "Mantis", image: "/api/placeholder/60/60" },
    { name: "Moth", image: "/api/placeholder/60/60" },
    { name: "Spider", image: "/api/placeholder/60/60" },
    { name: "Wasp", image: "/api/placeholder/60/60" },
    { name: "Bee", image: "/api/placeholder/60/60" },
    { name: "Cricket", image: "/api/placeholder/60/60" },
    { name: "Dragonfly", image: "/api/placeholder/60/60" },
    { name: "Firefly", image: "/api/placeholder/60/60" },
    { name: "Cicada", image: "/api/placeholder/60/60" },
    { name: "Centipede", image: "/api/placeholder/60/60" },
    { name: "Millipede", image: "/api/placeholder/60/60" },
    { name: "Caterpillar", image: "/api/placeholder/60/60" },
    { name: "Earwig", image: "/api/placeholder/60/60" },
    { name: "Mosquito", image: "/api/placeholder/60/60" },
    { name: "Fly", image: "/api/placeholder/60/60" },
    { name: "Stinkbug", image: "/api/placeholder/60/60" },
    { name: "Aphid", image: "/api/placeholder/60/60" },
    { name: "Termite", image: "/api/placeholder/60/60" },
    { name: "Pill Bug", image: "/api/placeholder/60/60" }
];

class SamplingSession {
    constructor(name, duration) {
        this.name = name;
        this.duration = duration;
        this.startTime = new Date();
        this.counts = new Array(bugTypes.length).fill(0);
        this.actions = []; // For undo functionality
        this.location = null;
        
        // Get location
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

        // Convert to CSV
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

let currentSession = null;
let timerInterval = null;

// Setup the bug grid
function setupGrid() {
    const grid = document.getElementById('bugGrid');
    bugTypes.forEach((bug, index) => {
        const cell = document.createElement('div');
        cell.className = 'bug-cell';
        cell.innerHTML = `
            <span class="bug-name">${bug.name}</span>
            <img src="${bug.image}" alt="${bug.name}">
            <span class="bug-count" id="count-${index}">0</span>
        `;
        
        cell.addEventListener('click', () => {
            if (currentSession) {
                const newCount = currentSession.incrementBug(index);
                document.getElementById(`count-${index}`).textContent = newCount;
            }
        });
        
        grid.appendChild(cell);
    });
}

// Setup undo button
document.getElementById('undoButton').addEventListener('click', () => {
    if (currentSession) {
        const undoneIndex = currentSession.undo();
        if (undoneIndex !== null) {
            document.getElementById(`count-${undoneIndex}`).textContent = 
                currentSession.counts[undoneIndex];
        }
    }
});

// Setup form submission
document.getElementById('samplingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('samplingName').value;
    const duration = parseInt(document.getElementById('duration').value);
    
    // Start new session
    currentSession = new SamplingSession(name, duration);
    
    // Switch screens
    document.getElementById('setupScreen').style.display = 'none';
    document.getElementById('samplingScreen').style.display = 'block';
    
    // Start timer
    let timeLeft = duration;
    const timerDisplay = document.getElementById('timer');
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time remaining: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endSampling();
        }
    }, 1000);
});

function endSampling() {
    if (!currentSession) return;
    
    const csv = currentSession.generateReport();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `sampling_${currentSession.name}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Reset for new sampling
    currentSession = null;
    document.getElementById('samplingScreen').style.display = 'none';
    document.getElementById('setupScreen').style.display = 'block';
    document.getElementById('samplingForm').reset();
    
    // Reset counts
    bugTypes.forEach((_, index) => {
        document.getElementById(`count-${index}`).textContent = '0';
    });
}

// Initialize the grid when the page loads
setupGrid();


class ScreenManager {
    constructor() {
        this.screens = document.querySelectorAll('.screen');
    }

    showScreen(screenName) {
        this.screens.forEach(screen => {
            const isTarget = screen.dataset.screen === screenName;
            screen.dataset.active = isTarget;
        });
    }

    getCurrentScreen() {
        return Array.from(this.screens).find(screen => 
            screen.dataset.active === "true"
        )?.dataset.screen;
    }
}

// Initialize screen manager
const screenManager = new ScreenManager();

// Update the form submission handler
document.getElementById('samplingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('samplingName').value;
    const duration = parseInt(document.getElementById('duration').value);
    
    // Start new session
    currentSession = new SamplingSession(name, duration);
    
    // Switch screens using screen manager
    screenManager.showScreen('sampling');
    
    // Start timer
    let timeLeft = duration;
    const timerDisplay = document.getElementById('timer');
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time remaining: ${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endSampling();
        }
    }, 1000);
});

function endSampling() {
    if (!currentSession) return;
    
    // ... existing CSV generation code ...
    
    // Reset for new sampling using screen manager
    currentSession = null;
    screenManager.showScreen('setup');
    document.getElementById('samplingForm').reset();
    
    // Reset counts
    bugTypes.forEach((_, index) => {
        document.getElementById(`count-${index}`).textContent = '0';
    });
}