import { ipcMain } from 'electron'
import { CHAT_AGENT_SEND_CHANNEL, CHAT_AGENT_READ_CHANNEL } from './chat-agent-channels'
import { ChatAgent } from '../../../../../backend-client'

export function chatAgentEventListeners(agent: ChatAgent): void {
  ipcMain.handle(CHAT_AGENT_SEND_CHANNEL, async (_evt, { msg }: { msg: string }) => {
    if (!agent) return 'Agent not started'

    agent.sendMessage(msg)
    return `Message sent to chat agent: ${msg}`
  })

  ipcMain.handle(CHAT_AGENT_READ_CHANNEL, async () => {
    if (!agent) return []
    return agent.read()
  })
}
