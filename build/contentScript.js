"use strict";
const socket = new WebSocket('ws://localhost:1987');
let isMuted = false;
let muteButton = null;
socket.addEventListener('open', () => {
    sendIdentification();
    sendMuteState();
});
socket.addEventListener('message', function (event) {
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
});
function toggleMute() {
    let muteButton = document.querySelector('[data-tooltip="Turn off microphone (⌘ + D)"]');
    let unmuteButton = document.querySelector('[data-tooltip="Turn on microphone (⌘ + D)"]');
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
    let unmuteButton = document.querySelector('[data-tooltip="Turn on microphone (⌘ + D)"]');
    if (unmuteButton) {
        unmuteButton.click();
    }
}
function mute() {
    let muteButton = document.querySelector('[data-tooltip="Turn off microphone (⌘ + D)"]');
    if (muteButton) {
        muteButton.click();
    }
}
function updateMuteState() {
    if (muteButton) {
        if (isMuted !== Boolean(muteButton.getAttribute("data-is-muted") === 'true')) {
            isMuted = Boolean(muteButton.getAttribute("data-is-muted") === 'true');
            sendMuteState();
        }
    }
}
function observeMuteStateChange() {
    muteButton = document.querySelectorAll("[data-tooltip][data-is-muted]")[0];
    if (muteButton) {
        clearInterval(findMuteButton);
        let observer = new MutationObserver(updateMuteState);
        observer.observe(muteButton, {
            childList: false,
            attributes: true,
            attributeFilter: ['data-is-muted'],
            subtree: false
        });
    }
}
let findMuteButton = window.setInterval(observeMuteStateChange, 250);
function sendMuteState() {
    const message = {
        'type': 'muteState',
        'value': isMuted ? 'muted' : 'unmuted'
    };
    socket.send(JSON.stringify(message));
}
function sendIdentification() {
    var identify = {
        'type': 'identify',
        'value': 'iamameet'
    };
    socket.send(JSON.stringify(identify));
}
//# sourceMappingURL=contentScript.js.map