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
    },
    saveYAML: (yaml, path) => {
      fs.writeFileSync(path, YAML.safeDump(yaml))
    },
    loadPreferences: () => {
      const preferencesFile = 'preferences.json'
      let preferences
      console.log('apppath: ', ipcRenderer.sendSync('appPath'))
      console.log('execpath', process.execPath)
      console.log('portable_executable_dir', process.env.PORTABLE_EXECUTABLE_DIR)
      console.log('__dirname: ', __dirname)
      if (fs.existsSync(path.join(ipcRenderer.sendSync('appPath'), preferencesFile))) {
        const contents = fs.readFileSync(path.join(ipcRenderer.sendSync('appPath'), preferencesFile))
        preferences = JSON.parse(contents)
      } else {
        preferences = { formats: [] }
      }
      return preferences
    },
    savePreferences: (preferences) => {
      const preferencesFile = 'preferences.json'
      fs.writeFileSync(path.join(ipcRenderer.sendSync('appPath'), preferencesFile), JSON.stringify(preferences, null, 4))
    }
  }
)
