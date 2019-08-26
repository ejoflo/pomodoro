const INTERVAL = 1000;
const SECONDS_PER_MINUTE = 60;
const timerDisplay = document.querySelector('.timer');
const sessionDisplay = document.querySelector('#session');
const roundDisplay = document.querySelector('#round');
const focusSettingDisplay = document.querySelector('#focusSetting');
const breakSettingDisplay = document.querySelector('#breakSetting');
const longBreakSettingDisplay = document.querySelector('#longBreakSetting');
const playPauseButton = document.querySelector('#playPause');
const soundButton = document.querySelector('#sound');

let focusDuration = 25;
let breakDuration = 5;
let longBreakDuration = 25;
let session = 'Focus';
let round = 1;
let totalRounds = 4;
let focusSession = true;
let timer = null;
let totalSeconds = focusDuration * SECONDS_PER_MINUTE;

function initializeDisplay() {
    displaySession();
    displayRound();
    displayTimer();
    displayProgressBar();
    setFocusSetting();
    setBreakSetting();
    setLongBreakSetting();
}

function displayProgressBar() {
    const progressBar = document.querySelector('path');      
    let sessionTotalLength = null;
    let length = progressBar.getTotalLength();

    switch (session) {  // assigns session color and progress bar duration
        
        case 'Focus':
            sessionTotalLength = focusDuration * SECONDS_PER_MINUTE;
            progressBar.style.stroke = '#1ED394'
            break;
        
        case 'Break':
            sessionTotalLength = breakDuration * SECONDS_PER_MINUTE;
            progressBar.style.stroke = '#EF8232'
            break;

        case 'Long Break':
            sessionTotalLength = longBreakDuration * SECONDS_PER_MINUTE;
            progressBar.style.stroke = '#D31E6B'
            break;
    }

    let offset = length - (((sessionTotalLength - totalSeconds) / sessionTotalLength) * length);

    progressBar.style.animation = 'none';   // clear any previous transition
    progressBar.style.strokeDasharray = length + ' ' + length;   // set up the starting positions
    progressBar.style.strokeDashoffset = offset;
}

function createListeners() {
    const restartButton = document.querySelector('#restart');
    const resetButton = document.querySelector('#reset');
    const previousButton = document.querySelector('#previous');
    const nextButton = document.querySelector('#next'); 
    const rewindButton = document.querySelector('#rewind'); 
    const forwardButton = document.querySelector('#forward');
    const focusPlusButton = document.querySelector('#focusPlus');
    const focusMinusButton = document.querySelector('#focusMinus');
    const breakPlusButton = document.querySelector('#breakPlus');
    const breakMinusButton = document.querySelector('#breakMinus');
    const longBreakPlusButton = document.querySelector('#longBreakPlus');
    const longBreakMinusButton = document.querySelector('#longBreakMinus');

    playPauseButton.addEventListener('click', (e) => {
        if (playPauseButton.className === 'play') {
            displayRound();
            startCountdown();  
            updatePlayPause();
        } else {
            stopCountdown();
            updatePlayPause();
        }
    });

    previousButton.addEventListener('click', (e) => {
        previousSession(previousButton.id);
    });

    nextButton.addEventListener('click', (e) => {
        nextSession(nextButton.id);
    });

    rewindButton.addEventListener('click', (e) => {
        rewindTime();
    });

    forwardButton.addEventListener('click', (e) => {
        forwardTime();
    });

    focusPlusButton.addEventListener('click', (e) => {
        setFocusSetting(focusPlusButton.id);
    });

    focusMinusButton.addEventListener('click', (e) => {
        setFocusSetting(focusMinusButton.id);
    });

    breakPlusButton.addEventListener('click', (e) => {
        setBreakSetting(breakPlusButton.id);
    });

    breakMinusButton.addEventListener('click', (e) => {
        setBreakSetting(breakMinusButton.id);
    });

    longBreakPlusButton.addEventListener('click', (e) => {
        setLongBreakSetting(longBreakPlusButton.id);
    });

    longBreakMinusButton.addEventListener('click', (e) => {
        setLongBreakSetting(longBreakMinusButton.id);
    });

    restartButton.addEventListener('click', (e) => {
        restart();
        playPauseButton.className = 'play';
    });

    resetButton.addEventListener('click', (e) => {
        reset();
        playPauseButton.className = 'play';
    });

    soundButton.addEventListener('click', (e) => {
        switchSound();
    });

    playPauseButton.addEventListener('touchstart', (e) => {
        if (playPauseButton.className === 'play') {
            displayRound();
            startCountdown();  
            updatePlayPause();
            e.preventDefault();
        } else {
            stopCountdown();
            updatePlayPause();
            e.preventDefault();
        }
    });

    previousButton.addEventListener('touchstart', (e) => {
        previousSession(previousButton.id);
        e.preventDefault();
    });

    nextButton.addEventListener('touchstart', (e) => {
        nextSession(nextButton.id);
        e.preventDefault();
    });

    rewindButton.addEventListener('touchstart', (e) => {
        rewindTime();
        e.preventDefault();
    });

    forwardButton.addEventListener('touchstart', (e) => {
        forwardTime();
        e.preventDefault();
    });

    focusPlusButton.addEventListener('touchstart', (e) => {
        setFocusSetting(focusPlusButton.id);
        e.preventDefault();
    });

    focusMinusButton.addEventListener('touchstart', (e) => {
        setFocusSetting(focusMinusButton.id);
        e.preventDefault();
    });

    breakPlusButton.addEventListener('touchstart', (e) => {
        setBreakSetting(breakPlusButton.id);
        e.preventDefault();
    });

    breakMinusButton.addEventListener('touchstart', (e) => {
        setBreakSetting(breakMinusButton.id);
        e.preventDefault();
    });

    longBreakPlusButton.addEventListener('touchstart', (e) => {
        setLongBreakSetting(longBreakPlusButton.id);
        e.preventDefault();
    });

    longBreakMinusButton.addEventListener('touchstart', (e) => {
        setLongBreakSetting(longBreakMinusButton.id);
        e.preventDefault();
    });

    restartButton.addEventListener('touchstart', (e) => {
        restart();
        playPauseButton.className = 'play';
        e.preventDefault();
    });

    resetButton.addEventListener('touchstart', (e) => {
        reset();
        playPauseButton.className = 'play';
        e.preventDefault();
    });

    soundButton.addEventListener('touchstart', (e) => {
        switchSound();
        e.preventDefault();
    });
}

function reset() {
    stopCountdown();
    soundButton.textContent = 'SOUND ON';
    focusDuration = 25;
    breakDuration = 5;
    longBreakDuration = 25;
    session = 'Focus';
    round = 1;
    totalRounds = 4;
    focusSession = true;
    timer = null;
    totalSeconds = focusDuration * SECONDS_PER_MINUTE;    
    displayTimer();
    displayProgressBar();
    displaySession();
    displayRound();
    setFocusSetting();
    setBreakSetting();
    setLongBreakSetting();
    updatePlayPause();
}

function startCountdown() {
    timer = setInterval(countdown, INTERVAL);
}

function stopCountdown() {
    clearInterval(timer);
}

function restart() {
    stopCountdown();
    session = 'Focus';
    round = 1;
    totalRounds = 4;
    focusSession = true;
    timer = null;
    totalSeconds = focusDuration * SECONDS_PER_MINUTE;    
    displayTimer();
    displayProgressBar();
    displaySession();
    displayRound();
    updatePlayPause();
}

function countdown() {
    --totalSeconds;
    if (totalSeconds < 0) {
        totalSeconds = 0;
    }
    displayTimer();
    displayProgressBar();
    
    if (totalSeconds === 0) {
        stopCountdown();
        switchSession();
        switchRound();
    }
}

function rewindTime() {
    let sessionDuration = null;

    switch (session) {
        
        case 'Focus':
            sessionDuration = focusDuration * SECONDS_PER_MINUTE;
            break;
        
        case 'Break':
            sessionDuration = breakDuration * SECONDS_PER_MINUTE;
            break;

        case 'Long Break':
            sessionDuration = longBreakDuration * SECONDS_PER_MINUTE;
            break;
    }
    totalSeconds += 30;
    
    if (totalSeconds > sessionDuration) {
        totalSeconds = sessionDuration;
    }
    displayTimer();
    displayProgressBar();
}

function forwardTime() {
    totalSeconds -= 30;

    if (totalSeconds < 0) {
        totalSeconds = 0;
    }
    displayTimer();
    displayProgressBar();
}

function previousSession(buttonName) {
    stopCountdown();
    switchSession();
    switchRound(buttonName);
    displayProgressBar();
    displayTimer();
}

function nextSession(buttonName) {
    stopCountdown();
    switchSession();
    switchRound(buttonName);
    displayProgressBar();
    displayTimer();
}

function switchSession() {
    focusSession = (focusSession) ? false : true;
    session = (focusSession) ? 'Focus' : 'Break';
}

function switchRound(direction) {
    if (direction === 'previous') {
        if (session === 'Break') {
            round--;
        } else if (session === 'Break' && round === 1) {
            round--;
        }
    } else if (direction === 'next') {
        if (session === 'Focus') {
            round++;
        }
    } else {
        round++;
    }
    session = (session === 'Focus') ? session : (round % 4 === 0) ? 'Long Break' : 'Break';
    displaySession();
    displayRound();
    updateTotalSeconds();
}

function updateTotalSeconds() {
    const button = document.querySelector('#playPause');

    totalSeconds = (focusSession) ? focusDuration * SECONDS_PER_MINUTE : (round % 4 === 0) ? longBreakDuration * SECONDS_PER_MINUTE : breakDuration * SECONDS_PER_MINUTE;

    if (button.className === 'pause') {
        timer = setInterval(countdown, INTERVAL);
    }
}

function updatePlayPause() {
    const button = document.querySelector('#playPause');

    if (button.className === 'play') {
        button.className = 'pause';
    } else {
        button.className = 'play';
    }
}

function setFocusSetting(buttonId) {
    if (buttonId === 'focusPlus') {
        if (focusDuration === 60) {
            focusDuration = 60;
        } else {
            focusDuration += 1;
        }
    } else if (buttonId === 'focusMinus') {
        if (focusDuration === 1) {
            focusDuration = 1;
        } else {
            focusDuration -= 1;
        }
    }
    focusSettingDisplay.textContent = focusDuration + ':00';
}

function setBreakSetting(buttonId) {
    if (buttonId === 'breakPlus') {
        if (breakDuration === 20) {
            breakDuration = 20;
        } else {
            breakDuration += 1;
        }
    } else if (buttonId === 'breakMinus') {
        if (breakDuration === 1) {
            breakDuration = 1;
        } else {
            breakDuration -= 1;
        }
    }
    breakSettingDisplay.textContent = breakDuration + ':00';
}

function setLongBreakSetting(buttonId) {
    if (buttonId === 'longBreakPlus') {
        if (longBreakDuration === 60) {
            longBreakDuration = 60;
        } else {
            longBreakDuration += 1;
        }
    } else if (buttonId === 'longBreakMinus') {
        if (longBreakDuration === 1) {
            longBreakDuration = 1;
        } else {
            longBreakDuration -= 1;
        }
    }
    longBreakSettingDisplay.textContent = longBreakDuration + ':00';
}

function displayTimer() {
    let minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
    let seconds = totalSeconds - (minutes * SECONDS_PER_MINUTE);

    if (seconds === 0) {
        timerDisplay.textContent = minutes + ':' + '00';
    } else if ((seconds < 10) && (seconds !== 0)) {
        timerDisplay.textContent = minutes + ':' + '0' + seconds;
    } else {
        timerDisplay.textContent = minutes + ':' + seconds;
    }

    switch (session) {  // changes timer color
        case 'Focus':
            timerDisplay.style.color = '#1ED394';
            break;
        case 'Break':
            timerDisplay.style.color = '#EF8232';
            break;
        case 'Long Break':
            timerDisplay.style.color = '#D31E6B';
            break;
    }
}

function switchSound() {
    soundButton.textContent = (soundButton.textContent === 'SOUND ON') ? 'SOUND OFF' : 'SOUND ON';
}

function playSound() {
    const focusSound = new Audio('./audio/focus.wav');
    const breakSound = new Audio('./audio/break.wav'); 
    const longBreakSound = new Audio('./audio/long_break.wav'); 

    focusSound.volume = 0.6;
    breakSound.volume = 0.6;   
    longBreakSound.volume = 0.6;   
    
    if (soundButton.textContent === 'SOUND OFF') {
        if (session === 'Break') { 
            breakSound.play();
        } else if (session === 'Long Break') {
            longBreakSound.play();
        } else if (session === 'Focus') {
            focusSound.play();
        }
    }
}

function displaySession() {  
    sessionDisplay.textContent = session;

    switch (session) {
        case 'Focus':
            sessionDisplay.style.color = '#1ED394';
            break;
        case 'Break':
            sessionDisplay.style.color = '#EF8232';
            break;
        case 'Long Break':
            sessionDisplay.style.color = '#D31E6B';
            break;
    }
    playSound();
}

function displayRound() {
    if (round > totalRounds) {
        round = 1;
    } else if (round < 1) {
        round = totalRounds;
    }
    roundDisplay.textContent = round + ' / ' + totalRounds;
}

initializeDisplay();
createListeners();
