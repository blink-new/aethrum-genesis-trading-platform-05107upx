import { motion } from 'framer-motion'
import { Settings } from 'lucide-react'

export function APIModule() {
  return (
    <div className="w-full h-full p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <Settings className="w-16 h-16 text-quantum-green mx-auto" />
        <h3 className="text-xl font-heading font-bold quantum-text">API Gateway</h3>
        <p className="text-quantum-blue/70 font-mono">Broker integration hub...</p>
      </motion.div>
    </div>
  )
}