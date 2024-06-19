// src/audio/audioContext.js

// Check for AudioContext compatibility (support for older browsers)
const AudioContext = window.AudioContext || window.webkitAudioContext;

// Create an instance of AudioContext
const audioContext = new AudioContext();
console.log('AudioContext created:', audioContext);

/**
 * Get the audio context instance.
 * If the audio context is suspended, it resumes it.
 * @returns {AudioContext} The audio context instance.
 */
const getAudioContext = () => {
  // Check if the audio context is suspended and resume if necessary
  if (audioContext.state === 'suspended') {
    console.log('AudioContext is suspended, resuming...');
    audioContext.resume().then(() => {
      console.log('AudioContext resumed');
    });
  } else {
    console.log('AudioContext state:', audioContext.state);
  }
  return audioContext;
};

// Make the audio context and getAudioContext function globally accessible
window.audioContext = audioContext;
window.getAudioContext = getAudioContext;
