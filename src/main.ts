import { SITES, TREATMENTS } from "./config.js";
import { ScreenManager } from "./screenManager.js";


// populate session form dropdowns

const siteSelect = document.getElementById('site') as HTMLSelectElement;
const treatmentSelect = document.getElementById('treatment') as HTMLSelectElement;

SITES.forEach(site => {
    const option = document.createElement('option');
    option.value = site;
    option.textContent = site;
    siteSelect.appendChild(option);
});

TREATMENTS.forEach(treatment => {
    const option = document.createElement('option');
    option.value = treatment;
    option.textContent = treatment;
    treatmentSelect.appendChild(option);
});

// set date and time

const dateInput = document.getElementById('samplingDate') as HTMLInputElement;
const hourInput = document.getElementById('samplingHour') as HTMLInputElement;

const updateDateTime = () => {
    const now = new Date();
    dateInput.value = now.toLocaleDateString();
    hourInput.value = now.toLocaleTimeString();
};

// set initial values
updateDateTime();

// update both every second
setInterval(updateDateTime, 1000);

new ScreenManager();