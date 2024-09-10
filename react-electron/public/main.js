const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let djangoProcess;

function startDjangoServer() {

    djangoProcess = spawn('python', [path.join(__dirname, '../app.asar/server', 'manage.py'), 'runserver', '--noreload']);

    djangoProcess.stdout.on('data', (data) => {
        console.log(`Django output: ${data}`);
    });

    djangoProcess.stderr.on('data', (data) => {
        console.error(`Django error: ${data}`);
    });

    djangoProcess.on('close', (code) => {
        console.log(`Django server exited with code ${code}`);
    });
}

function createWindow() {
    startDjangoServer();

    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            enableRemoteModule: true,
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, '../src/images/iconLPS.ico')
    });

    win.loadFile(path.join(__dirname, '../build/index.html'));

    win.on('closed', () => {
        if (djangoProcess) {
            djangoProcess.kill();
        }
    });
}

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        if (djangoProcess) {
            djangoProcess.kill();
        }
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
