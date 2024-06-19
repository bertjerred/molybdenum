// src/renderer.js

// Map to keep track of active oscillators for each note
const trackOscillators = new Map();

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the track when the document is fully loaded
    initializeTrack();
});

/**
 * Initialize the track controls.
 */
function initializeTrack() {
    // Get the track element
    const track = document.getElementById('track1');
    
    // Get the oscillator type select element
    const oscillatorSelect = track.querySelector('select');
    
    // Get the volume control slider element
    const volumeControl = track.querySelector('input[type="range"]');

    // Set up event listener for oscillator type selection change
    oscillatorSelect.addEventListener('change', () => {
        console.log(`Track oscillator type changed to ${oscillatorSelect.value}`);
    });

    // Set up event listener for volume control change
    volumeControl.addEventListener('input', () => {
        console.log(`Track volume changed to ${volumeControl.value}`);
    });
}

/**
 * Handle MIDI note on event.
 * @param {number} note - The MIDI note number.
 * @param {number} velocity - The velocity of the note.
 * @param {number} channel - The MIDI channel.
 */
function noteOn(note, velocity, channel) {
    const frequency = midiNoteToFrequency(note);
    const oscillatorType = document.querySelector('#track1 select').value;
    const volume = document.querySelector('#track1 input[type="range"]').value;
    const release = 1; // Ensure release is properly defined here
    const { oscillator, gainNode, filter, lfo } = startOscillator(createOscillator(oscillatorType, frequency), velocity, volume, 0.01, 0.1, 0.7, release);
    trackOscillators.set(note, { oscillator, gainNode, filter, lfo, release }); // Ensure release is stored in the map
    console.log(`Track note on: ${note}, velocity: ${velocity}, frequency: ${frequency}, volume: ${volume}`);
}

function noteOff(note, channel) {
    const oscObj = trackOscillators.get(note);
    if (oscObj) {
        stopOscillator(oscObj.oscillator, oscObj.gainNode, oscObj.release, oscObj.lfo); // Pass release from the stored object
        trackOscillators.delete(note);
        console.log(`Track note off: ${note}`);
    }
}

/**
 * Convert a MIDI note number to frequency.
 * @param {number} note - The MIDI note number.
 * @returns {number} The frequency in Hz.
 */
function midiNoteToFrequency(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
}

// Make noteOn and noteOff functions globally accessible
window.noteOn = noteOn;
window.noteOff = noteOff;
