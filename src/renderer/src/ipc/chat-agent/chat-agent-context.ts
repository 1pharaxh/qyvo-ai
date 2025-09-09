import { CHAT_AGENT_SEND_CHANNEL, CHAT_AGENT_READ_CHANNEL } from './chat-agent-channels'

export function exposechatAgentContext(): void {
  const { contextBridge, ipcRenderer } = window.require('electron')
  contextBridge.exposeInMainWorld('chatAgent', {
    send: (msg: string) => ipcRenderer.invoke(CHAT_AGENT_SEND_CHANNEL, { msg }),
    read: () => ipcRenderer.invoke(CHAT_AGENT_READ_CHANNEL)
  })
}
