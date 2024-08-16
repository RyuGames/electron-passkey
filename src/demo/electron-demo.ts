import { join } from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import Passkey from '..';

// https://github.com/electron/electron/issues/25153
// app.disableHardwareAcceleration();

let window: BrowserWindow;

const toggleMouseKey = 'CmdOrCtrl + J';
const toggleShowKey = 'CmdOrCtrl + K';

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

  window.loadURL('https://thirdweb.com/login?next=%2Fdashboard%2Fconnect%2Fin-app-wallets');

  window.webContents.openDevTools({ mode: 'detach', activate: false });
}

ipcMain.on('webauth-create', async (event, options) => {
  const result = await Passkey.handlePasskeyCreate(options);
  event.reply(result);
});

ipcMain.on('webauth-get', async (event, options) => {
  const result = await Passkey.handlePasskeyGet(options);
  event.reply(result);
});

app.on('ready', () => {
  setTimeout(
    createWindow,
    process.platform === 'linux' ? 1000 : 0 // https://github.com/electron/electron/issues/16809
  );
});
