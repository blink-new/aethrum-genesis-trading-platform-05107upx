import { motion } from 'framer-motion'
import { Bookmark } from 'lucide-react'

export function TemplatesModule() {
  return (
    <div className="w-full h-full p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <Bookmark className="w-16 h-16 text-quantum-orange mx-auto" />
        <h3 className="text-xl font-heading font-bold quantum-text">Templates Module</h3>
        <p className="text-quantum-blue/70 font-mono">Save complete workspace setups...</p>
      </motion.div>
    </div>
  )
}