// src/audio/midiHandler.js

// Declare MIDI access and input/output maps
let midiAccess = null;
const midiInputs = new Map();
const midiOutputs = new Map();

/**
 * Initialize MIDI access and setup handlers.
 */
async function initMIDI() {
    try {
        console.log('Requesting MIDI access...');
        midiAccess = await navigator.requestMIDIAccess();
        console.log('MIDI access granted:', midiAccess);
        setupMIDIHandlers(midiAccess);
        console.log('MIDI initialized successfully');
    } catch (error) {
        console.error('Failed to access MIDI:', error);
    }
}

/**
 * Setup handlers for MIDI inputs and outputs.
 * @param {MIDIAccess} midi - The MIDIAccess object.
 */
function setupMIDIHandlers(midi) {
    console.log('Setting up MIDI handlers...');
    midiInputs.clear();
    midiOutputs.clear();

    // Setup MIDI input handlers
    midi.inputs.forEach(input => {
        midiInputs.set(input.id, input);
        input.onmidimessage = handleMIDIMessage;
        console.log(`MIDI input added: ${input.name} [ID: ${input.id}]`);
    });

    // Setup MIDI output handlers
    midi.outputs.forEach(output => {
        midiOutputs.set(output.id, output);
        console.log(`MIDI output added: ${output.name} [ID: ${output.id}]`);
    });

    midi.onstatechange = handleMIDIConnectionEvent;
    populateMIDIDeviceDropdown();
    console.log('MIDI handlers set up successfully');
}

/**
 * Handle incoming MIDI messages.
 * @param {MIDIMessageEvent} message - The MIDI message event.
 */
function handleMIDIMessage(message) {
    const [status, data1, data2] = message.data;
    const command = status >> 4;
    const channel = status & 0xf;
    const note = data1;
    const velocity = data2;

    if (command === 9) {
        // Note on
        if (velocity > 0) {
            noteOn(note, velocity, channel);
        } else {
            noteOff(note, channel);
        }
    } else if (command === 8) {
        // Note off
        noteOff(note, channel);
    }

    // Log MIDI message details
    console.log(`MIDI message received: status=${status}, note=${note}, velocity=${velocity}`);
}

/**
 * Handle changes in MIDI connection state.
 * @param {MIDIConnectionEvent} event - The MIDI connection event.
 */
function handleMIDIConnectionEvent(event) {
    const port = event.port;
    console.log(`MIDI ${port.type} ${port.state}: ${port.name} [ID: ${port.id}]`);
    if (port.type === 'input') {
        if (port.state === 'connected' && !midiInputs.has(port.id)) {
            midiInputs.set(port.id, port);
            port.onmidimessage = handleMIDIMessage;
            console.log(`MIDI input connected: ${port.name} [ID: ${port.id}]`);
        } else if (port.state === 'disconnected' && midiInputs.has(port.id)) {
            midiInputs.delete(port.id);
            console.log(`MIDI input disconnected: ${port.name} [ID: ${port.id}]`);
        }
    } else if (port.type === 'output') {
        if (port.state === 'connected' && !midiOutputs.has(port.id)) {
            midiOutputs.set(port.id, port);
            console.log(`MIDI output connected: ${port.name} [ID: ${port.id}]`);
        } else if (port.state === 'disconnected' && midiOutputs.has(port.id)) {
            midiOutputs.delete(port.id);
            console.log(`MIDI output disconnected: ${port.name} [ID: ${port.id}]`);
        }
    }

    populateMIDIDeviceDropdown();
}

/**
 * Populate the MIDI device selection dropdown.
 */
function populateMIDIDeviceDropdown() {
    const midiSelect = document.getElementById('midiSelect');
    midiSelect.innerHTML = ''; // Clear existing options
    midiInputs.forEach((input, key) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = input.name;
        midiSelect.appendChild(option);
    });
}

// Make functions globally accessible
window.initMIDI = initMIDI;
window.getMIDIInputs = () => Array.from(midiInputs.values());
