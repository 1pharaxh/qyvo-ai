import { BrowserWindow, ipcMain } from 'electron'
import {
  WIN_ALLOW_MOUSE_PASS_THROUGH,
  WIN_CLOSE_CHANNEL,
  WIN_MAXIMIZE_CHANNEL,
  WIN_MINIMIZE_CHANNEL
} from './window-channels'

export function addWindowEventListeners(mainWindow: BrowserWindow) {
  ipcMain.handle(WIN_MINIMIZE_CHANNEL, () => {
    mainWindow.minimize()
  })
  ipcMain.handle(WIN_MAXIMIZE_CHANNEL, () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })
  ipcMain.handle(WIN_CLOSE_CHANNEL, () => {
    mainWindow.close()
  })

  ipcMain.handle(WIN_ALLOW_MOUSE_PASS_THROUGH, (_event, { allow }: { allow: boolean }) => {
    console.log('passing through is: ', allow)
    mainWindow.setIgnoreMouseEvents(allow, {
      forward: allow
    })
    return allow
  })
}
