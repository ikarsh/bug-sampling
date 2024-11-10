"use strict";
// import { Screen } from './types.js';
// export class ScreenManager {
//     private screens: NodeListOf<Screen>;
//     constructor() {
//         this.screens = document.querySelectorAll<Screen>('.screen');
//     }
//     showScreen(screenName: string): void {
//         this.screens.forEach(screen => {
//             const isTarget = screen.dataset.screen === screenName;
//             screen.dataset.active = isTarget.toString();
//         });
//     }
//     getCurrentScreen(): string | undefined {
//         return Array.from(this.screens).find(screen => 
//             screen.dataset.active === "true"
//         )?.dataset.screen;
//     }
// }
