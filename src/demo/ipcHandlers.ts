import { ipcMain } from 'electron';
import Passkey from '..';
import { CREATE_CREDS, GET_CREDS } from './ipcKeys';

ipcMain.handle(CREATE_CREDS, (event, options) => {
  console.log('Received webauth-create', event, options);
  return Passkey.getInstance().handlePasskeyCreate(options);
});

ipcMain.handle(GET_CREDS, (event, options) => {
  console.log('Received webauth-get', event, options);
  return Passkey.getInstance().handlePasskeyGet(options);
});
