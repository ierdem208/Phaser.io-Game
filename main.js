const { app, BrowserWindow, screen, ipcMain} = require('electron');
const path = require('path');


function createWindow () {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  const win = new BrowserWindow({
    width: width,
    height: height,
    icon: path.join(__dirname, 'assets/icon.ico'),
    backgroundColor: '#000000',
    frame: false,              // borderless window
    resizable: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  win.setMenuBarVisibility(false);
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('app-close', () => {
  app.quit();
});

