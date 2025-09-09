import { ChatAgent } from 'src/types'

declare global {
  interface Window {
    chatAgent: ChatAgent
  }
}

export async function sendtoChatAgent(e: string): Promise<void> {
  return await window.chatAgent.send(e)
}

export async function readFromChatAgent(): Promise<string[]> {
  return await window.chatAgent.read()
}
