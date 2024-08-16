import { ipcRenderer } from 'electron';

navigator.credentials.create = async function (options) {
    console.log(`Received navigator.credentials.create call with ${JSON.stringify(options)}`);
    return ipcRenderer.invoke('webauth-create', options);
};

navigator.credentials.get = async function (options) {
    console.log(`Received navigator.credentials.get call with ${JSON.stringify(options)}`);
    return await ipcRenderer.invoke('webauthn-get', options);
};
