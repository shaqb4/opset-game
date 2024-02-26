export const useTimer = (timeInMillisInput, updateIntervalInput) => {
    const time = toValue(timeInMillisInput);
    const updateInterval = toValue(updateIntervalInput);
    
    let endTime = Date.now() + time;
    let timeLeft = ref(0);

    let interval = ref(0);

    let onTimeout = null;
    
    const isRunning = () => {
        return interval.value > 0;
    }

    const calculateTimeLeft = () => {
        timeLeft.value = Math.max(0, endTime - Date.now());
    }

    const startTimer = () => {
        endTime = Date.now() + timeLeft.value;
        interval.value = setInterval(() => {
            calculateTimeLeft();
            if (timeLeft.value <= 0) {
                clearInterval(interval.value);
                interval.value = 0;
                onTimeout();
            }
        }, updateInterval);
    }

    const stopTimer = () => {
        if (isRunning()) {
            console.log(`Interval is ${interval.value}`);
            clearInterval(interval.value);
            interval.value = 0;
        }
    }

    const updateTimerBy = (millis) => {
        endTime += millis;
    };

    const resetTimer = () => {
        stopTimer();
        endTime = Date.now() + time;
        calculateTimeLeft();
    };

    const setOnTimeOut = (timeOutHandler) => {
        onTimeout = timeOutHandler;
    }

    return { timeLeft, isRunning, startTimer, stopTimer, updateTimerBy, resetTimer, setOnTimeOut }
}