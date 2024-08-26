import { ipcRenderer } from 'electron';
import Passkey from '..';

// navigator.credentials.create = (options) => {
//   console.log('Received navigator.credentials.create', options);
//   return ipcRenderer.invoke(CREATE_CREDS, options);
// };

// navigator.credentials.get = (options) => {
//   console.log('Received navigator.credentials.get', options);
//   return ipcRenderer.invoke(GET_CREDS, options);
// };

navigator.credentials.create = (options) =>
  Passkey.getInstance().attachCreateToRenderer(ipcRenderer, options);
navigator.credentials.get = (options) =>
  Passkey.getInstance().attachGetToRenderer(ipcRenderer, options);
