import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, Plus } from 'lucide-react'

const indicators = [
  { id: 'supertrend', name: 'MTF Supertrend', status: 'active', signal: 'BUY', strength: 85 },
  { id: 'rsi', name: 'RSI Divergence', status: 'active', signal: 'NEUTRAL', strength: 52 },
  { id: 'macd', name: 'MACD Histogram', status: 'inactive', signal: 'SELL', strength: 32 },
  { id: 'bollinger', name: 'Bollinger Bands', status: 'active', signal: 'BUY', strength: 78 }
]

export function IndicatorsModule() {
  return (
    <div className="w-full h-full p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-heading font-bold quantum-text">
            Neural Indicators
          </h2>
          <p className="text-quantum-blue/70 font-mono text-sm">
            AI-enhanced technical analysis
          </p>
        </div>
        <Button className="quantum-button">
          <Plus className="w-4 h-4 mr-2" />
          Add Indicator
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {indicators.map((indicator, index) => (
          <motion.div
            key={indicator.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-morphism border-quantum-blue/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-quantum-blue" />
                    <span>{indicator.name}</span>
                  </div>
                  <Badge variant={indicator.status === 'active' ? 'default' : 'secondary'}>
                    {indicator.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm">Signal</span>
                    <Badge className={`${
                      indicator.signal === 'BUY' ? 'bg-quantum-green' :
                      indicator.signal === 'SELL' ? 'bg-red-500' :
                      'bg-quantum-orange'
                    }`}>
                      {indicator.signal}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm">Strength</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 h-2 bg-quantum-dark rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-quantum-blue"
                          style={{ width: `${indicator.strength}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs">{indicator.strength}%</span>
                    </div>
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