import { BugInterface } from "./types.js";

export const SITES = ['Revadim north', 'Revadim east', 'Revadim south', 'Galon east', 'Galon west', 'Mishmar hanegev'];
export const TREATMENTS = ['Control', 'High variety mix', 'Low variety mix'];
export const SAMPLE_SIDES = ['sunny', 'shady'];

export const bugs: BugInterface[] = [
    { name: "Honey bee", image: "./images/honey-bee.png" },
    { name: "Syrphidae", image: "./images/syrphidae.png" },
    { name: "Calyptrata", image: "./images/calyptrata.png" },
    { name: "fly S", image: "./images/fly-small.png" },
    { name: "fly M", image: "./images/fly-medium.png" },
    { name: "fly L", image: "./images/fly-large.png" },
    { name: "Calliphoridae", image: "./images/calliphoridae.png" },
    { name: "Eristalinus", image: "./images/eristalinus.png" },
    { name: "Coleoptera", image: "./images/coleoptera.png" },
    { name: "Wild bee S", image: "./images/wild-bee-small.png" },
    { name: "Wild bee L", image: "./images/wild-bee-large.png" },
    { name: "Wasp", image: "./images/wasp.png" },
    { name: "Lepidoptera", image: "./images/lepidoptera.png" },
    { name: "Ant", image: "./images/ant.jpg" },
    { name: "Other", image: "./images/other.jpg" },
];

export const heb_names: { [key: string]: string } = {
    "Honey bee": "דבורת דבש", 
    "Syrphidae": "רחפן", 
    "Calyptrata": "קליפטרטה", 
    "fly S": "זבוב S", 
    "fly M": "זבוב M", 
    "fly L": "זבוב L", 
    "Calliphoridae": "בוהקן",
    "Eristalinus": "רקבן", 
    "Coleoptera": "חיפושית", 
    "Wild bee S": "דבורה S", 
    "Wild bee L": "דבורה L", 
    "Wasp": "צרעה", 
    "Lepidoptera": "פרפר", 
    "Ant": "נמלה", 
    "Other": "אחר"
};