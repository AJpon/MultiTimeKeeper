document.getElementById('addStopwatch').addEventListener('click', addStopwatch);

function addStopwatch() {
    const nameInput = document.getElementById('stopwatchName');
    const targetTimeInput = document.getElementById('targetTime');
    const startTimeInput = document.getElementById('startTime');

    const stopwatchContainer = document.createElement('div');
    stopwatchContainer.className = 'stopwatch';

    const nameContainer = document.createElement('div');
    nameContainer.className = 'watchName';
    stopwatchContainer.appendChild(nameContainer);

    const nameField = document.createElement('input');
    nameField.type = 'text';
    nameField.placeholder = 'New Timer';
    nameField.value = nameInput.value;
    nameField.style.display = 'none';
    nameContainer.appendChild(nameField);

    const nameDisplay = document.createElement('span');
    nameDisplay.textContent = nameInput.value;
    nameContainer.appendChild(nameDisplay);

    const targetTimeContainer = document.createElement('div');
    targetTimeContainer.className = 'targetTime';
    stopwatchContainer.appendChild(targetTimeContainer);

    const targetTimeField = document.createElement('input');
    targetTimeField.type = 'time';
    targetTimeField.value = targetTimeInput.value;
    targetTimeField.style.display = 'none';
    targetTimeContainer.appendChild(targetTimeField);

    const startTimeField = document.createElement('input');
    startTimeField.type = 'time';
    startTimeField.value = startTimeInput.value;
    startTimeField.style.display = 'none';
    stopwatchContainer.appendChild(startTimeField);

    const timeDisplay = document.createElement('span');
    timeDisplay.textContent = '00:00:00';
    stopwatchContainer.appendChild(timeDisplay);

    const remainingTimeDisplay = document.createElement('span');
    remainingTimeDisplay.textContent = 'Remaining Time: 00:00:00';
    stopwatchContainer.appendChild(remainingTimeDisplay);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'buttons';

    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Start';
    toggleButton.addEventListener('click', () => toggleStopwatch(toggleButton, timeDisplay, targetTimeField, startTimeField, remainingTimeDisplay));
    buttonContainer.appendChild(toggleButton);

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.addEventListener('click', () => resetStopwatch(timeDisplay, targetTimeField, startTimeField, remainingTimeDisplay));
    buttonContainer.appendChild(resetButton);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', () => toggleEditFields(nameField, targetTimeField, startTimeField, nameDisplay));
    buttonContainer.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteStopwatch(stopwatchContainer));
    buttonContainer.appendChild(deleteButton);

    stopwatchContainer.appendChild(buttonContainer);
    document.getElementById('stopwatches').appendChild(stopwatchContainer);

    // Add直後に開始時間と残り時間を反映
    resetStopwatch(timeDisplay, targetTimeField, startTimeField, remainingTimeDisplay);
}

function toggleEditFields(nameField, targetTimeField, startTimeField, nameDisplay) {
    const isHidden = nameField.style.display === 'none';
    nameField.style.display = isHidden ? 'block' : 'none';
    targetTimeField.style.display = isHidden ? 'block' : 'none';
    startTimeField.style.display = isHidden ? 'block' : 'none';
    nameDisplay.textContent = nameField.value;
}

function toggleStopwatch(button, display, targetTimeField, startTimeField, remainingTimeDisplay) {
    if (button.textContent === 'Start') {
        startStopwatch(display, targetTimeField, startTimeField, remainingTimeDisplay);
        button.textContent = 'Stop';
    } else {
        stopStopwatch(display);
        button.textContent = 'Start';
    }
}

function startStopwatch(display, targetTimeField, startTimeField, remainingTimeDisplay) {
    if (display.timer) return;
    const startTime = display.elapsedTime || parseTimeInput(startTimeField.value);
    display.startTime = Date.now() - startTime;
    display.elapsedTime = startTime;
    display.timer = setInterval(() => {
        display.elapsedTime = Date.now() - display.startTime;
        display.textContent = formatTime(display.elapsedTime);
        const targetTime = parseTimeInput(targetTimeField.value);
        if (targetTime !== null) {
            const remainingTime = targetTime - display.elapsedTime;
            remainingTimeDisplay.textContent = `Remaining Time: ${formatTime(Math.abs(remainingTime))}`;
            remainingTimeDisplay.style.color = remainingTime < 0 ? 'red' : 'green';
        }
    }, 1000);
}

function stopStopwatch(display) {
    clearInterval(display.timer);
    display.timer = null;
}

function resetStopwatch(display, targetTimeField, startTimeField, remainingTimeDisplay) {
    stopStopwatch(display);
    const startTime = parseTimeInput(startTimeField.value);
    const targetTime = parseTimeInput(targetTimeField.value);
    display.elapsedTime = startTime;
    display.textContent = formatTime(startTime);
    const remainingTime = targetTime - startTime;
    remainingTimeDisplay.textContent = `Remaining Time: ${formatTime(Math.abs(remainingTime))}`;
    remainingTimeDisplay.style.color = remainingTime < 0 ? 'red' : 'green';
}

function deleteStopwatch(container) {
    container.remove();
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function parseTimeInput(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    return (hours * 3600 + minutes * 60) * 1000;
}