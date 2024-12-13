export async function timer(timerElement, duration) {
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
}
