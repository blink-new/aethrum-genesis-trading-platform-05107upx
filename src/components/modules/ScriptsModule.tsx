import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Code, FileText, Plus, Play, Pause } from 'lucide-react'

const scripts = [
  { id: 'js1', name: 'trendline.js', language: 'JavaScript', status: 'running' },
  { id: 'py1', name: 'volatility_bot.py', language: 'Python', status: 'stopped' },
  { id: 'lua1', name: 'risklogic.lua', language: 'Lua', status: 'running' },
  { id: 'wasm1', name: 'volume_calc.wasm', language: 'WASM', status: 'paused' },
  { id: 'sql1', name: 'historical_filter.sql', language: 'SQL', status: 'running' },
  { id: 'ts1', name: 'alertManager.ts', language: 'TypeScript', status: 'stopped' }
]

export function ScriptsModule() {
  return (
    <div className="w-full h-full p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-heading font-bold quantum-text">
            Universal Scripts
          </h2>
          <p className="text-quantum-blue/70 font-mono text-sm">
            Multi-language execution environment
          </p>
        </div>
        <Button className="quantum-button">
          <Plus className="w-4 h-4 mr-2" />
          New Script
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scripts.map((script, index) => (
          <motion.div
            key={script.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="glass-morphism border-quantum-blue/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-quantum-green" />
                    <span className="font-mono">{script.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {script.language}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`status-indicator ${
                      script.status === 'running' ? 'status-active' :
                      script.status === 'paused' ? 'status-warning' : 'status-inactive'
                    }`} />
                    <span className="text-xs font-mono">{script.status}</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" className="quantum-button p-1">
                      {script.status === 'running' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </Button>
                    <Button size="sm" variant="outline" className="quantum-button p-1">
                      <FileText className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}