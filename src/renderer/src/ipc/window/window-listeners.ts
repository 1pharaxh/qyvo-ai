import { app, BrowserWindow, ipcMain } from 'electron'
import {
  WIN_ALLOW_MOUSE_PASS_THROUGH,
  WIN_CLOSE_CHANNEL,
  WIN_CURRENT_WIN_ICON,
  WIN_MAXIMIZE_CHANNEL,
  WIN_MINIMIZE_CHANNEL
} from './window-channels'
import { activeWindowSync } from 'get-windows'

export function addWindowEventListeners(mainWindow: BrowserWindow): void {
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

  ipcMain.handle(WIN_CURRENT_WIN_ICON, async () => {
    try {
      const win = activeWindowSync()
      if (!win) return ''
      if (win.title.includes('Electron') || win.title.includes('qyvo')) return 'skip'
      const icon = await app.getFileIcon(win.owner.path, {
        size: 'large'
      })
      return icon.toDataURL()
    } catch (err) {
      console.error('Error getting icon', err)
      return ''
    }
  })
}
