'use strict'

import { app, protocol, BrowserWindow, dialog, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import path from 'path'
const zmq = require('zeromq')
const fs = require('fs')
const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function runClient () {
  const sock = new zmq.Request()
  sock.connect('tcp://localhost:1234')
  const params = {
    mode: 'read',
    args: {
      arg1: '1',
      arg2: '2'
    }
  }
  await sock.send(JSON.stringify(params))
  const [result] = await sock.receive()
  console.log('Received ', result.toString())
}

async function createWindow () {
  // Create the browser window.
  const getSourceDirectory = () => isDevelopment
    ? path.join(process.cwd(), 'src')
    : path.join(process.resourcesPath, 'app', 'src')

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      // preload: path.join(__dirname, 'preload.js')
      preload: path.resolve(getSourceDirectory(), 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.on('loadJSON', (event, args) => {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'JSON (.json)', extensions: ['json'] }
    ]
  }).then(
    function (path) {
      event.returnValue = path
    }
  )
})

ipcMain.on('loadYAML', (event, args) => {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'YAML (.yaml, yml)', extensions: ['yaml', 'yml'] }
    ]
  }).then(
    function (path) {
      event.returnValue = path
    }
  )
})

ipcMain.on('openDirectory', (event, args) => {
  dialog.showOpenDialog({ properties: ['openDirectory'] }).then(
    function (path) {
      event.returnValue = path
    }
  )
})

ipcMain.on('openFile', (event, args) => {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'Images (.png, .jpg)', extensions: ['png', 'jpg', 'jpeg'] },
      { name: 'Movies (.mkv, .avi, .mp4)', extensions: ['mkv', 'avi', 'mp4'] },
      { name: 'Text (.text, .txt)', extensions: ['text', 'txt'] }
    ]
  }).then(
    function (path) {
      event.returnValue = path
    }
  )
})

ipcMain.on('saveFile', (event, args) => {
  dialog.showSaveDialog({
    properties: ['createDirectory', 'showOverwriteConfirmation'],
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'Images (.png, .jpg)', extensions: ['png', 'jpg', 'jpeg'] },
      { name: 'Movies (.mkv, .avi, .mp4)', extensions: ['mkv', 'avi', 'mp4'] },
      { name: 'Text (.text, .txt)', extensions: ['text', 'txt'] }
    ]
  }).then(
    function (path) {
      event.returnValue = path
    }
  )
})

ipcMain.on('loadPreferences', (event, args) => {
  const preferencesFile = 'preferences.json'

  console.log('apppath: ', app.getAppPath())
  console.log('execpath', process.execPath)
  console.log('portable_executable_dir', process.env.PORTABLE_EXECUTABLE_DIR)
  console.log('__dirname: ', __dirname)
  const contents = fs.readFileSync(path.join(app.getAppPath(), preferencesFile))
  const preferences = JSON.parse(contents)
  event.returnValue = preferences
})
