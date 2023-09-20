const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
let win
function createWindow() {
  // Create a browser window
    win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true // Enable Node.js integration in the renderer process
    }
  });

  
  // Load the HTML file into the window
  win.loadFile('index.html');
}


function createPopupWindow() {
  popup = new BrowserWindow({
    width: 300,
    height: 300,
    webPreferences: {
      nodeIntegration: true
    },
    parent: win,
    frame: false,
    modal: true
  })

  popupWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'popup.html'),
    protocol: 'file:',
    slashes: true,
  }));

  // Handle closing the popup window
  popupWindow.on('closed', () => {
    popupWindow = null;
  });
}

// Create a new Electron app window when the app is ready
app.whenReady().then(() => {
  createWindow();
  if (process.env.NODE_ENV === 'development') {
    require('electron-reloader')(module);
  }
  // Quit the app when all windows are closed (except on macOS)
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


// Create a new window when the app is activated (on macOS)
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

win.webContents.on('did-finish-load', () => {
  createPopupWindow();
});

ipcMain.on('open-popup', () => {
  if (!popupWindow) {
    createPopupWindow();
  }
});