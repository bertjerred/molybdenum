// Import necessary modules from Electron
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

/**
 * Create the main application window.
 */
function createWindow () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Path to the preload script
            contextIsolation: true, // Enable context isolation for security
            enableRemoteModule: false // Disable remote module for security
        }
    });

    // Load the main HTML file into the window
    mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

    // Handle the 'closed' event
    mainWindow.on('closed', function () {
        mainWindow = null; // Dereference the window object
    });
}

// Create the window when the app is ready
app.on('ready', createWindow);

// Quit the app when all windows are closed, except on macOS
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Re-create the window when the app is activated (macOS specific)
app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
