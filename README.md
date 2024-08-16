# electron-passkey

Native module for electron applications to use passkey funcitonality

### Usage

1) Intercept calls in the renderer process or preload
```js
import { ipcRenderer } from 'electron';

navigator.credentials.create = async function (options) {
  return ipcRenderer.invoke('webauth-create', options);
};

navigator.credentials.get = async function (options) {
  return await ipcRenderer.invoke('webauthn-get', options);
};
```

2) Forward calls in main process

```js
import Passkey from 'electron-passkey';

ipcMain.on('webauth-create', async (event, options) => {
  const result = await Passkey.handlePasskeyCreate(options);
  event.reply(result);
});

ipcMain.on('webauth-get', async (event, options) => {
  const result = await Passkey.handlePasskeyGet(options);
  event.reply(result);
});
```

### Deployments

![Deployments](Deployment.png "Deplyoments")