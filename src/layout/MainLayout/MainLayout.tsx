import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../../components/Header/Header'
import Chatbot from '../../components/Chatbot/Chatbot.tsx'
import styles from './MainLayout.module.scss' // Import the CSS module

interface Bubble {
  id: number
  x: number
  y: number
}

const MainLayout: React.FC<LayoutProps> = ({ children }) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([])
  const [greenBubbles, setGreenBubbles] = useState<Bubble[]>([])

  const handleMouseMove = (e: MouseEvent) => {
    const newBubble: Bubble = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY
    }
    setBubbles((prevBubbles) => [...prevBubbles, newBubble])
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const newGreenBubble: Bubble = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY
    }
    setGreenBubbles((prevBubbles) => [...prevBubbles, newGreenBubble])
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setGreenBubbles((prevBubbles) => prevBubbles.filter((bubble) => Date.now() - bubble.id < 1000))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles((prevBubbles) => prevBubbles.filter((bubble) => Date.now() - bubble.id < 1000))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`h-screen flex flex-col overflow-hidden relative`} onClick={handleClick}>
      <Header />
      <div className='flex-1 overflow-auto p-0 m-0'>{children}</div>
      <Outlet />
      <Chatbot />
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={styles.bubble}
          style={{
            left: bubble.x,
            top: bubble.y
          }}
        ></div>
      ))}
      {greenBubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={styles.greenBubble}
          style={{
            left: bubble.x,
            top: bubble.y
          }}
        ></div>
      ))}

      {/* <Footer /> */}
    </div>
  )
}

export default MainLayout
