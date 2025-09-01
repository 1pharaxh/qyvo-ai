import { ElectronWindow } from 'src/types'

declare global {
  interface Window {
    electronWindow: ElectronWindow
  }
}

export async function minimizeWindow(): Promise<void> {
  await window.electronWindow.minimize()
}
export async function maximizeWindow(): Promise<void> {
  await window.electronWindow.maximize()
}
export async function closeWindow(): Promise<void> {
  await window.electronWindow.close()
}

export async function passthroughWindow(allow: boolean): Promise<void> {
  await window.electronWindow.passthrough(allow)
}
