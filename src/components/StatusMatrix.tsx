import { motion } from 'framer-motion'
import { Wifi, Zap, Database, Cpu, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SystemStatus {
  quantum_core: 'online' | 'optimizing' | 'offline'
  neural_feeds: 'streaming' | 'syncing' | 'disconnected'
  data_matrix: 'stable' | 'fluctuating' | 'error'
  ai_modules: 'active' | 'standby' | 'inactive'
  time_sync: 'synchronized' | 'adjusting' | 'desync'
}

export function StatusMatrix() {
  const [status, setStatus] = useState<SystemStatus>({
    quantum_core: 'online',
    neural_feeds: 'streaming',
    data_matrix: 'stable',
    ai_modules: 'active',
    time_sync: 'synchronized'
  })

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Simulate status fluctuations
    const statusTimer = setInterval(() => {
      setStatus(prev => ({
        ...prev,
        neural_feeds: Math.random() > 0.1 ? 'streaming' : 'syncing',
        data_matrix: Math.random() > 0.05 ? 'stable' : 'fluctuating'
      }))
    }, 3000)

    return () => {
      clearInterval(timer)
      clearInterval(statusTimer)
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'streaming':
      case 'stable':
      case 'active':
      case 'synchronized':
        return 'text-quantum-green'
      case 'optimizing':
      case 'syncing':
      case 'fluctuating':
      case 'standby':
      case 'adjusting':
        return 'text-quantum-orange'
      default:
        return 'text-red-400'
    }
  }

  const getStatusIcon = (key: keyof SystemStatus) => {
    const iconClass = "w-4 h-4"
    switch (key) {
      case 'quantum_core':
        return <Cpu className={iconClass} />
      case 'neural_feeds':
        return <Wifi className={iconClass} />
      case 'data_matrix':
        return <Database className={iconClass} />
      case 'ai_modules':
        return <Zap className={iconClass} />
      case 'time_sync':
        return <Clock className={iconClass} />
    }
  }

  return (
    <div className="flex items-center space-x-6">
      {/* System Status Indicators */}
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(status).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center space-y-1"
          >
            <div className={`${getStatusColor(value)} flex items-center space-x-1`}>
              {getStatusIcon(key as keyof SystemStatus)}
              <div className={`status-indicator ${
                value.includes('online') || value.includes('streaming') || value.includes('stable') || value.includes('active') || value.includes('synchronized')
                  ? 'status-active'
                  : value.includes('optimizing') || value.includes('syncing') || value.includes('fluctuating') || value.includes('standby') || value.includes('adjusting')
                  ? 'status-warning'
                  : 'status-inactive'
              }`} />
            </div>
            <div className="text-xs font-mono text-quantum-blue/60 uppercase text-center leading-tight">
              {key.replace('_', ' ')}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Separator */}
      <div className="w-px h-8 bg-quantum-blue/20" />

      {/* Time Display */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="text-right"
      >
        <div className="text-sm font-mono text-quantum-blue hologram-text">
          {currentTime.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          })}
        </div>
        <div className="text-xs font-mono text-quantum-blue/60">
          TERRA-SOL {currentTime.toLocaleDateString('en-US')}
        </div>
      </motion.div>

      {/* Neural Activity Indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
        className="relative w-8 h-8 flex items-center justify-center"
      >
        <motion.div
          animate={{ 
            rotate: 360,
            opacity: [0.3, 1, 0.3]
          }}
          transition={{ 
            rotate: { duration: 8, repeat: Infinity, ease: "linear" },
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-6 h-6 border-2 border-quantum-blue/40 rounded-full"
          style={{
            borderTopColor: '#00D9FF',
            borderRightColor: 'transparent'
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-quantum-blue rounded-full pulse-live" />
        </div>
      </motion.div>
    </div>
  )
}