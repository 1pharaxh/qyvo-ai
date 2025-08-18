import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { exposeWindowContext } from '../renderer/src/ipc/window/window-context'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    exposeWindowContext()
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore
  require('../renderer/src/ipc/window/window-context').exposeWindowContext()
}
