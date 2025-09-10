'use client'

import { createContext, JSX, useContext, useEffect, useRef } from 'react'
import { Loader, Mail, User, Waves } from 'lucide-react'
import { HTMLMotionProps, motion, useDragControls, useReducedMotion } from 'framer-motion'
import { Button } from '../src/components/ui/button'
import {
  DynamicContainer,
  DynamicDescription,
  DynamicDiv,
  DynamicIsland,
  DynamicIslandProvider,
  DynamicTitle,
  type SizePresets,
  useDynamicIslandSize
} from '../src/components/ui/dynamic-island'
import { syncThemeWithLocal } from './ipc/theme-helper'
import { passthroughWindow } from './ipc/window-helper'
import { sendtoChatAgent } from './ipc/chat-agent-helpers'
import CurrentFileIcon from './components/ui/current-file-icon'

const DynamicAction = (): JSX.Element => {
  const { state: blobState, setSize } = useDynamicIslandSize()

  const blobStates: SizePresets[] = [
    'compact',
    'large',
    'tall',
    'long',
    'medium',
    'minimalTrailing'
  ]

  const handleIslandClick = (): void => {
    const currentIndex = blobStates.indexOf(blobState.size as SizePresets)
    const nextIndex = (currentIndex + 1) % blobStates.length
    sendtoChatAgent(
      'What is 2 + 3 and 4 + 5, also add the sum of both and tell me the final answer!'
    )

    setSize(blobStates[nextIndex])
  }

  const RenderCompactState = (): JSX.Element => {
    return (
      <DynamicContainer className="flex items-center justify-center h-full w-full">
        <div className="relative w-full flex items-center">
          <DynamicDescription className="absolute left-4  my-auto text-lg font-medium tracking-tighter text-white ">
            <CurrentFileIcon />
          </DynamicDescription>
          <DynamicDescription className="absolute text-white right-4  my-auto text-lg font-bold tracking-tighter ">
            newcult.co
          </DynamicDescription>
        </div>
      </DynamicContainer>
    )
  }

  const renderLargeState = (): JSX.Element => (
    <DynamicContainer className="flex items-center justify-center h-full w-full">
      <div className="relative  flex w-full items-center justify-between gap-6 px-4">
        <Loader className="animate-spin h-12 w-12  text-yellow-300" />

        <DynamicTitle className="my-auto text-2xl font-black tracking-tighter text-white ">
          loading
        </DynamicTitle>
      </div>
    </DynamicContainer>
  )

  const renderTallState = (): JSX.Element => (
    <DynamicContainer className="  flex flex-col mt-6 w-full items-start  gap-1 px-8 font-semibold">
      <DynamicDescription className="bg-cyan-300 rounded-2xl tracking-tight leading-5  p-2">
        The Cult of Pythagoras
      </DynamicDescription>
      <DynamicDescription className="bg-cyan-300 rounded-2xl tracking-tight leading-5  p-2 text-left">
        Music of the Spheres, an idea that celestial bodies produce a form of music through their
        movements
      </DynamicDescription>

      <DynamicTitle className=" text-4xl font-black tracking-tighter text-cyan-100 ">
        any cool cults?
      </DynamicTitle>
    </DynamicContainer>
  )

  const renderLongState = (): JSX.Element => (
    <DynamicContainer className="flex items-center justify-center h-full w-full">
      <DynamicDiv className="relative  flex w-full items-center justify-between gap-6 px-4">
        <div>
          <Waves className=" text-cyan-400 h-8 w-8" />
        </div>

        <DynamicTitle className="my-auto text-xl font-black tracking-tighter text-white ">
          Supercalifragilisticexpialid
        </DynamicTitle>
      </DynamicDiv>
    </DynamicContainer>
  )

  const renderMediumState = (): JSX.Element => (
    <DynamicContainer className="flex flex-col justify-between px-2 pt-4 text-left text-white h-full">
      <DynamicTitle className="text-2xl pl-3 font-black tracking-tighter">
        Reincarnation, welcome back
      </DynamicTitle>
      <DynamicDescription className="leading-5 text-neutral-500 pl-3">
        Good for small tasks or call outs
      </DynamicDescription>

      <DynamicDiv className="flex flex-col mt-auto space-y-1 mb-2 bg-neutral-700 p-2 rounded-b-2xl">
        <Button>
          <Mail className="mr-2 h-4 w-4 fill-cyan-400 text-neutral-900" /> Login with email
        </Button>

        <Button className="mt-1 ">
          <User className="mr-2 h-4 w-4 fill-cyan-400 text-cyan-400" /> Join the cult now
        </Button>
      </DynamicDiv>
    </DynamicContainer>
  )

  const renderOtherStates = (): JSX.Element => (
    <div className="flex items-center justify-center h-full w-full">
      <div>
        <CurrentFileIcon />
      </div>
      <p className="text-white">cycle states</p>
    </div>
  )

  const renderminimalTrailingStates = (): JSX.Element => (
    <div className="flex items-center justify-center h-full w-full">
      <div>
        <CurrentFileIcon />
      </div>
    </div>
  )

  function renderState(): JSX.Element {
    switch (blobState.size) {
      case 'compact':
        return RenderCompactState()
      case 'large':
        return renderLargeState()
      case 'tall':
        return renderTallState()
      case 'medium':
        return renderMediumState()
      case 'long':
        return renderLongState()
      case 'minimalTrailing':
        return renderminimalTrailingStates()
      default:
        return renderOtherStates()
    }
  }

  return (
    <div className=" h-full">
      <div className="flex flex-col gap-4  h-full">
        <div
          onClick={handleIslandClick}
          className="cursor-pointer"
          onMouseEnter={() => passthroughWindow(false)}
          onMouseLeave={() => passthroughWindow(true)}
        >
          <DynamicIsland id="dynamic-blob">{renderState()}</DynamicIsland>
        </div>
      </div>
    </div>
  )
}

export function App(): JSX.Element {
  useEffect(() => {
    syncThemeWithLocal()
  }, [])

  const mainRef = useRef<HTMLDivElement>(null)

  const controls = useDragControls()
  return (
    <main
      ref={mainRef}
      className="flex items-center justify-center-safe h-screen w-screen overflow-hidden"
    >
      <DynamicIslandProvider initialSize={'default'}>
        <motion.div
          drag
          dragControls={controls}
          dragMomentum={false}
          dragElastic={0}
          dragConstraints={mainRef}
        >
          <DynamicAction />
        </motion.div>
      </DynamicIslandProvider>
    </main>
  )
}

const FadeInStaggerContext = createContext(false)

const viewport = { once: true, margin: '0px 0px -200px' }

export function FadeIn(props: HTMLMotionProps<'div'>): JSX.Element {
  const shouldReduceMotion = useReducedMotion()
  const isInStaggerGroup = useContext(FadeInStaggerContext)

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5 }}
      {...(isInStaggerGroup
        ? {}
        : {
            initial: 'hidden',
            whileInView: 'visible',
            viewport
          })}
      {...props}
    />
  )
}

export function FadeInStagger({ faster = false, ...props }: { faster: boolean }): JSX.Element {
  return (
    <FadeInStaggerContext.Provider value={true}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewport}
        transition={{ staggerChildren: faster ? 0.12 : 0.2 }}
        {...props}
      />
    </FadeInStaggerContext.Provider>
  )
}

export default App
