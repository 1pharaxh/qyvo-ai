import { exposechatAgentContext } from './chat-agent/chat-agent-context'
import { exposeThemeContext } from './theme/theme-context'
import { exposeWindowContext } from './window/window-context'

export default function exposeContexts(): void {
  exposeWindowContext()
  exposeThemeContext()
  exposechatAgentContext()
}
