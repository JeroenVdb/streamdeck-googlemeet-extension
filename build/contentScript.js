"use strict";
let socket = new WebSocket('ws://localhost:1987');
let isMuted = false;
let muteButton = null;
socket.addEventListener('open', () => {
    sendIdentification();
    sendMuteState();
});
socket.addEventListener('message', function (event) {
    console.log(`[extension] received event: ${event.data}`);
    var message = JSON.parse(event.data);
    if (message.type === 'action') {
        if (message.value === 'mute') {
            mute();
        }
        else if (message.value === 'unmute') {
            unmute();
        }
        else if (message.value === 'togglemute') {
            toggleMute();
        }
        else {
            console.log('Dont know this action: ' + message.value);
        }
    }
    else if (message.type === 'request') {
        if (message.value === 'muteState') {
            updateMuteState();
        }
    }
});
function toggleMute() {
    let muteButton = document.querySelector('[aria-label="Turn off microphone (⌘ + D)"]');
    let unmuteButton = document.querySelector('[aria-label="Turn on microphone (⌘ + D)"]');
    if (muteButton) {
        muteButton.click();
    }
    else if (unmuteButton) {
        unmuteButton.click();
    }
    else {
        throw Error('No mute or unmute button found');
    }
}
function unmute() {
    let unmuteButton = document.querySelector('[aria-label="Turn on microphone (⌘ + D)"]');
    if (unmuteButton) {
        unmuteButton.click();
    }
}
function mute() {
    let muteButton = document.querySelector('[aria-label="Turn off microphone (⌘ + D)"]');
    if (muteButton) {
        muteButton.click();
    }
}
function updateMuteState() {
    let muteButton = document.querySelectorAll("[data-is-muted]")[0];
    if (muteButton) {
        if (isMuted !== Boolean(muteButton.getAttribute("data-is-muted") === 'true')) {
            isMuted = Boolean(muteButton.getAttribute("data-is-muted") === 'true');
            sendMuteState();
        }
    }
}
let findMuteButton = window.setInterval(updateMuteState, 250);
function sendMuteState() {
    const message = {
        'type': 'muteState',
        'value': isMuted ? 'muted' : 'unmuted'
    };
    socket.send(JSON.stringify(message));
}
function sendIdentification() {
    const identify = {
        'type': 'identify',
        'value': 'iamameet'
    };
    socket.send(JSON.stringify(identify));
}
//# sourceMappingURL=contentScript.js.map