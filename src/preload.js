const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')

contextBridge.exposeInMainWorld(
  'myAPI', {
    openDirectory: () => ipcRenderer.sendSync('openDirectory'),
    openFile: () => ipcRenderer.sendSync('openFile'),
    loadPreferences: () => {
      const result = ipcRenderer.sendSync('loadPreferences')
      if (result.canceled) {
        return null
      }
      const contents = fs.readFileSync(result.filePaths[0])
      return JSON.parse(contents)
    }
  }
)
