import { BugInterface } from "./types.js";

export const SITES = ['Revadim North', 'Revadim East', 'Revadim South', 'Galon East', 'Galon West', 'Mishmar Hanegev'];
export const TREATMENTS = ['Control', 'High variety mix', 'Low variety mix'];
export const SAMPLE_SIDES = ['light', 'dark'];

export const bugs: BugInterface[] = [
    { name: "דבורת דבש", image: "./images/honey-bee.jpg" },
    { name: "רחפן", image: "./images/syrphidae.jpg" },
    { name: "רקבן", image: "./images/eristalinus.jpg" },
    { name: "קליפטרטה", image: "./images/calyptrata.jpg" },
    { name: "זבוב L", image: "./images/calliphoridae.jpg" },
    { name: "זבוב M", image: "./images/calliphoridae.jpg" },
    { name: "זבוב S", image: "./images/calliphoridae.jpg" },
    { name: "דבורת בר S", image: "./images/wild-bee.jpg" },
    { name: "דבורת בר L", image: "./images/wild-bee.jpg" },
    { name: "חיפושית", image: "./images/coleoptera.jpg" },
    { name: "צרעה", image: "./images/wasp.jpg" },
    { name: "פרפר", image: "./images/lepidoptera.jpg" },
    { name: "נמלה", image: "./images/ant.jpg" },
    { name: "אחר", image: "/api/placeholder/60/60" },
];