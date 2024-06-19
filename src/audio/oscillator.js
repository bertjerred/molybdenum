// src/audio/oscillator.js

console.log('Loading oscillator module...');

/**
 * Create an oscillator node.
 * @param {string} type - The type of oscillator ('sine', 'square', 'sawtooth', 'triangle').
 * @param {number} frequency - The frequency of the oscillator.
 * @returns {OscillatorNode} The created oscillator node.
 */
const createOscillator = (type = 'sine', frequency = 440) => {
    const audioContext = getAudioContext();
    console.log('Creating oscillator with type:', type, 'and frequency:', frequency);

    const oscillator = audioContext.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    console.log('Oscillator created:', oscillator);

    return oscillator;
};

/**
 * Create an LFO and connect it to the target parameter.
 * @param {number} frequency - The frequency of the LFO.
 * @param {AudioParam} targetParam - The parameter to modulate.
 * @returns {OscillatorNode} The LFO oscillator node.
 */
const createLFO = (frequency, targetParam) => {
    const audioContext = getAudioContext();
    const lfo = audioContext.createOscillator();
    lfo.type = 'triangle';
    lfo.frequency.setValueAtTime(frequency, audioContext.currentTime);

    const lfoGain = audioContext.createGain();
    lfoGain.gain.setValueAtTime(75, audioContext.currentTime); // Adjust the depth of the LFO

    lfo.connect(lfoGain);
    lfoGain.connect(targetParam);
    lfo.start();

    console.log('LFO created with frequency:', frequency);

    return lfo;
};

/**
 * Start the oscillator with an ADSR envelope and LPF with LFO.
 * @param {OscillatorNode} oscillator - The oscillator node to start.
 * @param {number} velocity - The velocity of the note.
 * @param {number} volume - The volume level (0-100).
 * @param {number} attack - The attack time in seconds.
 * @param {number} decay - The decay time in seconds.
 * @param {number} sustain - The sustain level (0-1).
 * @param {number} release - The release time in seconds.
 * @returns {Object} An object containing the oscillator, gain node, filter, and LFO.
 */
const startOscillator = (oscillator, velocity, volume, attack = 0.01, decay = 0.1, sustain = 0.7, release = 1) => {
    const audioContext = getAudioContext();
    const gainNode = audioContext.createGain();
    const maxGain = volume / 100;
    const sustainGain = maxGain * sustain;

    // Create and configure the filter
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, audioContext.currentTime); // Slightly higher base frequency to reduce overlap distortion
    filter.Q.setValueAtTime(2, audioContext.currentTime); // Lower resonance to reduce distortion

    // Create and connect the LFO to the filter's cutoff frequency
    const lfo = createLFO(4, filter.frequency); // 4 Hz LFO frequency for modulation

    // Apply attack
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(maxGain, audioContext.currentTime + attack);

    // Apply decay
    gainNode.gain.linearRampToValueAtTime(sustainGain, audioContext.currentTime + attack + decay);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();

    // Schedule release
    gainNode.gain.setValueAtTime(sustainGain, audioContext.currentTime + (velocity / 127));
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + (velocity / 127) + release);

    console.log('Oscillator started with ADSR envelope and LPF LFO:', oscillator);

    return { oscillator, gainNode, filter, lfo, release }; // Ensure release is included in the returned object
};

/**
 * Stop the oscillator with a release phase.
 * @param {OscillatorNode} oscillator - The oscillator node to stop.
 * @param {GainNode} gainNode - The gain node controlling the volume.
 * @param {number} release - The release time in seconds.
 * @param {OscillatorNode} lfo - The LFO oscillator node.
 */
const stopOscillator = (oscillator, gainNode, release, lfo) => {
    const audioContext = getAudioContext();
    const currentTime = audioContext.currentTime;

    // Ensure release is a finite number
    if (!isFinite(release)) {
        console.error('Invalid release time:', release);
        release = 0.5; // Default release time if invalid
    }

    // Apply release
    gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
    gainNode.gain.linearRampToValueAtTime(0, currentTime + release);

    // Stop the oscillator and LFO after the release time
    oscillator.stop(currentTime + release);
    lfo.stop(currentTime + release);

    console.log('Oscillator and LFO stopped with release phase:', oscillator);
};

// Make the oscillator functions globally accessible
window.createOscillator = createOscillator;
window.startOscillator = startOscillator;
window.stopOscillator = stopOscillator;
