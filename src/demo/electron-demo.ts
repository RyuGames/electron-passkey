import { join } from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import Passkey from '..';

// https://github.com/electron/electron/issues/25153
// app.disableHardwareAcceleration();

Passkey.getInstance().attachHandlersToMain(ipcMain);

let window: BrowserWindow;

function createWindow() {
  window = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: join(__dirname, 'preload.js'),
    },
  });

  window.loadURL(
    'https://thirdweb.com/login?next=%2Fdashboard%2Fconnect%2Fin-app-wallets',
  );

  window.webContents.openDevTools();

  console.log(Passkey.getPackageName());
}

app.on('ready', () => {
  setTimeout(createWindow, 500);
});
