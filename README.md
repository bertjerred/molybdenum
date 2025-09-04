
# molybdenum
a simple MIDI-controlled music app

![screenshot of the molybdenum UI](https://github.com/bertjerred/media/blob/main/molybdenum/Screenshot%20of%20the%20Molybdenum%20UI.png?raw=true)

## details
This app runs HTML/JS in its own browser, allowing users to connect a MIDI device
and play notes. I began with four simple oscillators and eventually added a few
hard-coded refinements: a subtle ADSR envelope and "Biquad filter" LFO.
These are ripe for improvements or for breaking out into the UI.

There is plenty of console logging going on, too (CTRL+SHIFT+I).
I designed this app as an exercise in learning about Electron.
Overall, this is meant for basic sound-making on low-end devices.

## how to run molybdenum
Extract the source code and look for `index.html` (in the `src` folder).
Open it in a browser and allow, as necessary, your browser to connect to MIDI devices.
Then, play your MIDI device (e.g., keyboard) and try different waveforms.
