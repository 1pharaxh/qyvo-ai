import { getCurrentIcon } from '@renderer/ipc/window-helper'
import { MessageCircle } from 'lucide-react'
import { JSX, useEffect, useState } from 'react'

const ICON_STORAGE_KEY = 'lastValidIcon'

const CurrentFileIcon = (): JSX.Element => {
  const [icon, setIcon] = useState<string | null>(() => {
    return localStorage.getItem(ICON_STORAGE_KEY)
  })

  useEffect(() => {
    const timer = setInterval(async () => {
      const res = await getCurrentIcon()

      if (res && res !== 'skip') {
        setIcon(res)
        // persist in localStorage
        localStorage.setItem(ICON_STORAGE_KEY, res)
      }
      // if res === "skip", do nothing -> keeps last valid icon
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return icon ? (
    <img src={icon} className="h-7 w-7" />
  ) : (
    <MessageCircle className="h-5 w-5 fill-cyan-400 text-cyan-400" />
  )
}

export default CurrentFileIcon
