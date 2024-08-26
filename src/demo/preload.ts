import { ipcRenderer } from 'electron';
import { CREATE_CREDS, GET_CREDS } from './ipcKeys';

navigator.credentials.create = (options) => {
  console.log('Received navigator.credentials.create', options);
  return ipcRenderer.invoke(CREATE_CREDS, options);
};

navigator.credentials.get = (options) => {
  console.log('Received navigator.credentials.get', options);
  return ipcRenderer.invoke(GET_CREDS, options);
};
