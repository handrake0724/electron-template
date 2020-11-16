const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')
const YAML = require('js-yaml')

contextBridge.exposeInMainWorld(
  'myAPI', {
    openDirectory: () => ipcRenderer.sendSync('openDirectory'),
    openFile: () => ipcRenderer.sendSync('openFile'),
    saveFile: () => ipcRenderer.sendSync('saveFile'),
    loadJSON: () => {
      const result = ipcRenderer.sendSync('loadJSON')
      if (result.canceled) {
        return null
      }
      const contents = fs.readFileSync(result.filePaths[0])
      return { state: result, json: JSON.parse(contents) }
    },
    loadYAML: () => {
      const result = ipcRenderer.sendSync('loadYAML')
      if (result.canceled) {
        return null
      }
      const contents = fs.readFileSync(result.filePaths[0])
      return { state: result, yaml: YAML.safeLoad(contents) }
    }
  }
)
