import { useRef } from 'react'

import {
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverForm,
  PopoverLabel,
  PopoverRoot,
  PopoverSubmitButton,
  PopoverTextarea,
  PopoverTrigger
} from './components/ui/popover'
import { passthroughWindow } from './ipc/window-helper'
import { TextShimmer } from './components/motion-primitives/text-shimmer'

function App(): React.JSX.Element {
  const handleSubmit = (note: string) => {
    console.log('Submitted note:', note)
  }

  const mainRef = useRef<HTMLDivElement>(null)

  return (
    <main
      ref={mainRef}
      className="flex items-center justify-center h-screen w-screen overflow-hidden"
    >
      <PopoverRoot dragConstraintsMainRef={mainRef}>
        <PopoverTrigger
          onMouseEnter={() => passthroughWindow(false)}
          onMouseLeave={() => passthroughWindow(true)}
        >
          <TextShimmer className="text-sm">Ask AI</TextShimmer>
        </PopoverTrigger>
        <PopoverContent
          onMouseEnter={() => passthroughWindow(false)}
          onMouseLeave={() => passthroughWindow(true)}
        >
          <PopoverForm onSubmit={handleSubmit}>
            <PopoverLabel>
              <TextShimmer className="text-sm">Ask AI</TextShimmer>
            </PopoverLabel>
            <PopoverTextarea />
            <PopoverFooter>
              <PopoverCloseButton />
              <PopoverSubmitButton />
            </PopoverFooter>
          </PopoverForm>
        </PopoverContent>
      </PopoverRoot>
    </main>
  )
}

export default App
