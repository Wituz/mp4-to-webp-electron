const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    // Window control functions
    windowControls: {
      minimize: () => ipcRenderer.send('window-minimize'),
      maximize: () => ipcRenderer.send('window-maximize'),
      close: () => ipcRenderer.send('window-close'),
    },
    // File handling functions
    handleFileDrop: (filePaths, settings) => ipcRenderer.invoke('file-drop', filePaths, settings),
    selectFiles: () => ipcRenderer.invoke('select-files'),
    getVideoDimensions: (filePath) => ipcRenderer.invoke('get-video-dimensions', filePath),
    // Event listeners
    onProgress: (callback) => ipcRenderer.on('conversion-progress', (event, data) => callback(data)),
    onComplete: (callback) => ipcRenderer.on('conversion-complete', (event, data) => callback(data)),
  }
);