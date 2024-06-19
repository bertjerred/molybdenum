// preload.js

// Import required modules from Electron
const { contextBridge, ipcRenderer } = require('electron');

// Use contextBridge to expose the ipcRenderer methods in the main world
contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        /**
         * Send data to the main process via the specified channel.
         * @param {string} channel - The channel name.
         * @param {*} data - The data to send.
         */
        send: (channel, data) => ipcRenderer.send(channel, data),

        /**
         * Listen for data from the main process via the specified channel.
         * @param {string} channel - The channel name.
         * @param {function} func - The callback function to handle the data.
         */
        on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    }
});
