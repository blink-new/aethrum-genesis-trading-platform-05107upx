import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface SystemBootupProps {
  onBootComplete: () => void
}

const bootSequence = [
  { message: "INITIALIZING QUANTUM CORE...", duration: 800 },
  { message: "LOADING NEURAL NETWORKS...", duration: 600 },
  { message: "ESTABLISHING EXCHANGE FEEDS...", duration: 700 },
  { message: "ACTIVATING AION MODULES...", duration: 500 },
  { message: "SYNCHRONIZING TIME MATRIX...", duration: 400 },
  { message: "CALIBRATING TRADING ALGORITHMS...", duration: 600 },
  { message: "SYSTEM READY - WELCOME TO AETHRUM", duration: 800 }
]

export function SystemBootup({ onBootComplete }: SystemBootupProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const executeBootSequence = async () => {
      for (let i = 0; i < bootSequence.length; i++) {
        setCurrentStep(i)
        setProgress((i / bootSequence.length) * 100)
        
        await new Promise(resolve => setTimeout(resolve, bootSequence[i].duration))
      }
      
      setProgress(100)
      setIsComplete(true)
      
      // Wait a moment then complete boot
      setTimeout(() => {
        onBootComplete()
      }, 1000)
    }

    executeBootSequence()
  }, [onBootComplete])

  return (
    <div className="fixed inset-0 bg-quantum-deep flex items-center justify-center">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-quantum-blue/5 via-quantum-purple/5 to-quantum-green/5" />
      
      {/* Central Boot Interface */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl mx-auto px-8"
      >
        {/* AETHRUM Logo */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-heading font-black quantum-text mb-4">
            AETHRUM
          </h1>
          <div className="text-quantum-blue/70 text-lg font-mono">
            GENESIS TRADING PLATFORM • YEAR 12000
          </div>
        </motion.div>

        {/* Boot Messages */}
        <div className="mb-8 h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentStep < bootSequence.length && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <div className="text-xl font-mono text-quantum-blue hologram-text mb-2">
                  {bootSequence[currentStep]?.message}
                </div>
                <div className="flex justify-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        opacity: [0.3, 1, 0.3],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                      className="w-2 h-2 bg-quantum-blue rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full h-2 bg-quantum-dark/50 rounded-full overflow-hidden glass-morphism">
            <motion.div
              className="h-full bg-gradient-to-r from-quantum-blue via-quantum-purple to-quantum-green"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{
                boxShadow: '0 0 20px rgba(0, 217, 255, 0.6)'
              }}
            />
          </div>
          
          {/* Progress Percentage */}
          <motion.div
            className="absolute -top-8 left-0 text-quantum-blue font-mono text-sm"
            style={{ left: `${Math.max(0, Math.min(95, progress))}%` }}
          >
            {Math.round(progress)}%
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isComplete ? 1 : 0.7 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`status-indicator ${isComplete ? 'status-active' : 'status-warning'}`} />
              <span className="text-sm font-mono text-quantum-blue/70">
                QUANTUM CORE
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`status-indicator ${progress > 50 ? 'status-active' : 'status-inactive'}`} />
              <span className="text-sm font-mono text-quantum-blue/70">
                NEURAL NET
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`status-indicator ${progress > 80 ? 'status-active' : 'status-inactive'}`} />
              <span className="text-sm font-mono text-quantum-blue/70">
                FEED SYNC
              </span>
            </div>
          </div>
        </motion.div>

        {/* Ready State */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="mt-8 text-center"
            >
              <div className="text-quantum-green hologram-text text-lg font-mono font-bold">
                SYSTEM ONLINE • READY FOR NEURAL LINK
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}