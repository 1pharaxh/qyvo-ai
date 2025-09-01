import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import exposeContexts from '../renderer/src/ipc/context-exposer'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    exposeContexts()
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('../renderer/src/ipc/window/window-context').exposeWindowContext()
}
