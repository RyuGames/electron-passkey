# electron-passkey

Native module for electron applications to use passkey funcitonality

### Usage

1) Intercept calls in the renderer process or preload
```js
import { ipcRenderer } from 'electron';

navigator.credentials.create = function (options) {
  return ipcRenderer.invoke('webauthn-create', options);
};

navigator.credentials.get = function (options) {
  return ipcRenderer.invoke('webauthn-get', options);
};
```

2) Forward calls in main process

```js
import Passkey from 'electron-passkey';

ipcMain.handle('webauthn-create', (event, options) => {
  return Passkey.handlePasskeyCreate(options);
});

ipcMain.handle('webauthn-get', (event, options) => {
  return Passkey.handlePasskeyGet(options);
});
```

### Deployments

![Deployments](Deployment.png "Deplyoments")