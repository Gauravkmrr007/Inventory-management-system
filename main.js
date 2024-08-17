const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const server = require('./app')
// var db = require('./database');

let mainWindow
function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1500,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        },
    
    })
    mainWindow.loadURL('http://localhost:3003'),
    mainWindow.on('closed', function () {
        app.quit();
    })
}
app.on('ready', createWindow);
