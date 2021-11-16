let socket = new WebSocket('ws://localhost:1987');

let isMuted = false;
let muteButton: HTMLElement | null = null;

socket.addEventListener('open', () => {
    sendIdentification();
    sendMuteState();
});

socket.addEventListener('message', function (event) {
    console.log(`[extension] received event: ${event.data}`);

    var message: actionMessage | requestMessage = JSON.parse(event.data);
    if (message.type === 'action') {
        if (message.value === 'mute') {
            mute();
        } else if (message.value === 'unmute') {
            unmute()
        } else if (message.value === 'togglemute') {
            toggleMute();
        } else {
            console.log('Dont know this action: ' + message.value);
        }
    } else if (message.type === 'request') {
        if (message.value === 'muteState') {
            updateMuteState();
        }
    }
});

type actionMessage = {
    type: 'action';
    value: string;
}

type requestMessage = {
    type: 'request';
    value: string;
}

type muteStateMessage = {
    type: 'muteState';
    value: 'muted' | 'unmuted';
}

type identifyMessage = {
    type: 'identify';
    value: string;
}

function toggleMute() {
    let muteButton = document.querySelector('[aria-label="Turn off microphone (⌘ + D)"]') as HTMLElement;
    let unmuteButton = document.querySelector('[aria-label="Turn on microphone (⌘ + D)"]') as HTMLElement;

    if (muteButton) {
        muteButton.click();
    } else if (unmuteButton) {
        unmuteButton.click();
    } else {
        throw Error('No mute or unmute button found');
    }
}

function unmute() {
    let unmuteButton = document.querySelector('[aria-label="Turn on microphone (⌘ + D)"]') as HTMLElement;

    if (unmuteButton) {
        unmuteButton.click();
    } else {
        console.log('No unmute button found, the call might already be unmuted');
    }
}

function mute() {
    let muteButton = document.querySelector('[aria-label="Turn off microphone (⌘ + D)"]') as HTMLElement;

    if (muteButton) {
        muteButton.click();
    } else {
        console.log('No mute button found, the call might already be muted');
    }
}

function updateMuteState() {
    let muteButton = document.querySelectorAll("[aria-label*=microphone][data-is-muted]")[0] as HTMLElement;
    if (muteButton) {
        if (isMuted !== Boolean(muteButton.getAttribute("data-is-muted") === 'true')) {
            isMuted = Boolean(muteButton.getAttribute("data-is-muted") === 'true');
            sendMuteState();
        }
    } else {
        throw Error('Could not get muteState, could not find a mute or unmute button');
    }
}

let findMuteButton = window.setInterval(updateMuteState, 250);

function sendMuteState() {
    const message: muteStateMessage = {
        'type': 'muteState',
        'value': isMuted ? 'muted' : 'unmuted'
    };
    socket.send(JSON.stringify(message));
}

function sendIdentification() {
    const identify: identifyMessage = {
        'type': 'identify',
        'value': 'iamameet'
    };
    socket.send(JSON.stringify(identify));
}

