var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function timer(timerElement, duration) {
    return __awaiter(this, void 0, void 0, function* () {
        let timeLeft = duration;
        // show initial state
        timerElement.textContent = `Time: ${timeLeft}s`;
        timeLeft--;
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                timerElement.textContent = `Time: ${timeLeft}s`;
                timeLeft--;
                if (timeLeft < 0) {
                    clearInterval(interval);
                    resolve();
                }
            }, 1000);
        });
    });
}
