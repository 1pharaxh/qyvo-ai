import { BrowserWindow } from 'electron'
import { addThemeEventListeners } from './theme/theme-listeners'
import { addWindowEventListeners } from './window/window-listeners'
import { chatAgentEventListeners } from './chat-agent/chat-agent-listeners'
import { ChatAgent } from '../../../../backend-client'

export default function registerListeners(mainWindow: BrowserWindow, agent: ChatAgent): void {
  addWindowEventListeners(mainWindow)
  addThemeEventListeners()
  chatAgentEventListeners(agent)
}
