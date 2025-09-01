import { contextBridge, ipcRenderer } from 'electron'
import {
  WIN_MINIMIZE_CHANNEL,
  WIN_MAXIMIZE_CHANNEL,
  WIN_CLOSE_CHANNEL,
  WIN_ALLOW_MOUSE_PASS_THROUGH
} from './window-channels'

export function exposeWindowContext(): void {
  contextBridge.exposeInMainWorld('electronWindow', {
    minimize: () => ipcRenderer.invoke(WIN_MINIMIZE_CHANNEL),
    maximize: () => ipcRenderer.invoke(WIN_MAXIMIZE_CHANNEL),
    close: () => ipcRenderer.invoke(WIN_CLOSE_CHANNEL),
    passthrough: (allow: boolean) => ipcRenderer.invoke(WIN_ALLOW_MOUSE_PASS_THROUGH, { allow })
  })
}
