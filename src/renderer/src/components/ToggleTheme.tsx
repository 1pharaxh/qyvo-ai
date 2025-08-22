import { Moon } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { toggleTheme } from '@renderer/ipc/theme-helper'

export default function ToggleTheme() {
  return (
    <Button onClick={toggleTheme} size="icon" variant="outline" type="button">
      <Moon size={16} />
    </Button>
  )
}
