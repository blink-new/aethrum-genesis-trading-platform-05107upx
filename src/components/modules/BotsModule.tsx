import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bot, Play, Pause, Plus } from 'lucide-react'

const bots = [
  { id: 'scalping', name: 'Quantum Scalping Bot', status: 'running', profit: '+12.4%', trades: 247 },
  { id: 'grid', name: 'Neural Grid Bot', status: 'paused', profit: '+8.7%', trades: 89 },
  { id: 'dca', name: 'DCA Strategy Bot', status: 'running', profit: '+15.2%', trades: 156 },
  { id: 'arbitrage', name: 'Cross-Exchange Arb', status: 'stopped', profit: '+3.1%', trades: 23 }
]

export function BotsModule() {
  return (
    <div className="w-full h-full p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-heading font-bold quantum-text">
            Trading Bots
          </h2>
          <p className="text-quantum-blue/70 font-mono text-sm">
            Autonomous trading algorithms
          </p>
        </div>
        <Button className="quantum-button">
          <Plus className="w-4 h-4 mr-2" />
          Deploy Bot
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bots.map((bot, index) => (
          <motion.div
            key={bot.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-morphism border-quantum-blue/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-quantum-purple" />
                    <span>{bot.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {bot.status === 'running' && <Play className="w-4 h-4 text-quantum-green" />}
                    {bot.status === 'paused' && <Pause className="w-4 h-4 text-quantum-orange" />}
                    <Badge variant={bot.status === 'running' ? 'default' : 'secondary'}>
                      {bot.status}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm">P&L</span>
                    <span className="font-mono text-quantum-green">{bot.profit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm">Trades</span>
                    <span className="font-mono text-white">{bot.trades}</span>
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