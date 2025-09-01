import { Moon } from 'lucide-react'
import { Button } from './ui/button'
import { toggleTheme } from '@renderer/ipc/theme-helper'
import { JSX } from 'react'

export default function ToggleTheme(): JSX.Element {
  return (
    <Button onClick={toggleTheme} size="icon" variant="outline" type="button">
      <Moon size={16} />
    </Button>
  )
}
