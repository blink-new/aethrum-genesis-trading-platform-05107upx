import { motion } from 'framer-motion'
import { useState } from 'react'
import { CoreHub } from './CoreHub'
import { QuantumBackground } from './QuantumBackground'
import { StatusMatrix } from './StatusMatrix'
import { SystemBootup } from './SystemBootup'

export function AethrumShell() {
  const [isBooted, setIsBooted] = useState(false)

  const handleBootComplete = () => {
    setIsBooted(true)
  }

  if (!isBooted) {
    return <SystemBootup onBootComplete={handleBootComplete} />
  }

  return (
    <div className="relative w-full h-screen bg-quantum-deep overflow-hidden">
      {/* Quantum Background */}
      <QuantumBackground />
      
      {/* Main Interface */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 w-full h-full"
      >
        {/* Top Status Bar */}
        <header className="w-full h-16 glass-morphism border-b border-quantum-blue/20 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.h1 
              className="text-2xl font-heading font-bold quantum-text"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              AETHRUM
            </motion.h1>
            <div className="text-xs text-quantum-blue/70 font-mono">
              Genesis v12000.1.0
            </div>
          </div>
          
          <StatusMatrix />
        </header>

        {/* Main Content Area */}
        <main className="w-full h-[calc(100vh-4rem)] flex">
          <CoreHub />
        </main>
      </motion.div>
    </div>
  )
}