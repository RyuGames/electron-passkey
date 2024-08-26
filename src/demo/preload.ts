import { ipcRenderer } from 'electron';
import Passkey from '..';

navigator.credentials.create = (options) =>
  Passkey.getInstance().attachCreateToRenderer(ipcRenderer, options);
navigator.credentials.get = (options) =>
  Passkey.getInstance().attachGetToRenderer(ipcRenderer, options);
