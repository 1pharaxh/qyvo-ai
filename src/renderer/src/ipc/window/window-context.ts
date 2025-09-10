import { contextBridge, ipcRenderer } from 'electron'
import {
  WIN_MINIMIZE_CHANNEL,
  WIN_MAXIMIZE_CHANNEL,
  WIN_CLOSE_CHANNEL,
  WIN_ALLOW_MOUSE_PASS_THROUGH,
  WIN_CURRENT_WIN_ICON
} from './window-channels'

export function exposeWindowContext(): void {
  contextBridge.exposeInMainWorld('electronWindow', {
    minimize: () => ipcRenderer.invoke(WIN_MINIMIZE_CHANNEL),
    maximize: () => ipcRenderer.invoke(WIN_MAXIMIZE_CHANNEL),
    close: () => ipcRenderer.invoke(WIN_CLOSE_CHANNEL),
    passthrough: (allow: boolean) => ipcRenderer.invoke(WIN_ALLOW_MOUSE_PASS_THROUGH, { allow }),
    getCurrentIcon: () => ipcRenderer.invoke(WIN_CURRENT_WIN_ICON)
  })
}
