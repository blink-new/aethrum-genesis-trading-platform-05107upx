import { motion } from 'framer-motion'
import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wifi, WifiOff, TrendingUp } from 'lucide-react'

const exchanges = [
  { 
    id: 'binance', 
    name: 'Binance', 
    color: '#F3BA2F',
    status: 'connected',
    latency: 12,
    price: 45234.56,
    volume: '1.2B'
  },
  { 
    id: 'bybit', 
    name: 'Bybit', 
    color: '#F7A600',
    status: 'connected',
    latency: 18,
    price: 45231.89,
    volume: '890M'
  },
  { 
    id: 'kraken', 
    name: 'Kraken', 
    color: '#5741D9',
    status: 'connected',
    latency: 25,
    price: 45228.44,
    volume: '456M'
  },
  { 
    id: 'coinbase', 
    name: 'Coinbase', 
    color: '#0052FF',
    status: 'disconnected',
    latency: 0,
    price: 0,
    volume: '0'
  }
]

export function ExchangeModule() {
  const [activeExchanges, setActiveExchanges] = useState(['binance', 'bybit', 'kraken'])
  const [aggregateMode, setAggregateMode] = useState(true)

  const toggleExchange = (exchangeId: string) => {
    setActiveExchanges(prev => 
      prev.includes(exchangeId) 
        ? prev.filter(id => id !== exchangeId)
        : [...prev, exchangeId]
    )
  }

  const getAggregatedPrice = () => {
    const activePrices = exchanges
      .filter(ex => activeExchanges.includes(ex.id) && ex.status === 'connected')
      .map(ex => ex.price)
    
    if (activePrices.length === 0) return 0
    return activePrices.reduce((sum, price) => sum + price, 0) / activePrices.length
  }

  return (
    <div className="w-full h-full p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-heading font-bold quantum-text">
              Exchange Feed Nexus
            </h2>
            <p className="text-quantum-blue/70 font-mono text-sm">
              Multi-source quantum price aggregation
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-mono text-quantum-blue">Aggregate Mode</span>
              <Switch
                checked={aggregateMode}
                onCheckedChange={setAggregateMode}
                className="data-[state=checked]:bg-quantum-blue"
              />
            </div>
          </div>
        </div>

        {/* Aggregated Price Display */}
        {aggregateMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-morphism p-4 quantum-glow"
          >
            <div className="text-center">
              <div className="text-xs font-mono text-quantum-blue/70 mb-1">
                QUANTUM MEAN PRICE (QMP)
              </div>
              <div className="text-3xl font-mono text-quantum-green hologram-text">
                ${getAggregatedPrice().toFixed(8)}
              </div>
              <div className="text-sm font-mono text-quantum-blue/70 mt-1">
                Aggregated from {activeExchanges.filter(id => 
                  exchanges.find(ex => ex.id === id)?.status === 'connected'
                ).length} active sources
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Exchange Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exchanges.map((exchange, index) => (
          <motion.div
            key={exchange.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`glass-morphism border-quantum-blue/20 hover:border-quantum-blue/40 transition-all ${
              activeExchanges.includes(exchange.id) ? 'quantum-glow' : ''
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: exchange.color }}
                    />
                    <span className="font-heading text-white">{exchange.name}</span>
                    {exchange.status === 'connected' ? (
                      <Wifi className="w-4 h-4 text-quantum-green" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-red-400" />
                    )}
                  </CardTitle>
                  
                  <Switch
                    checked={activeExchanges.includes(exchange.id)}
                    onCheckedChange={() => toggleExchange(exchange.id)}
                    disabled={exchange.status === 'disconnected'}
                    className="data-[state=checked]:bg-quantum-blue"
                  />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {exchange.status === 'connected' ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono text-quantum-blue/70">Price</span>
                      <span className="font-mono text-white">
                        ${exchange.price.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono text-quantum-blue/70">Volume</span>
                      <span className="font-mono text-quantum-blue">
                        {exchange.volume}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono text-quantum-blue/70">Latency</span>
                      <Badge variant="outline" className={`${
                        exchange.latency < 20 ? 'border-quantum-green text-quantum-green' : 
                        exchange.latency < 50 ? 'border-quantum-orange text-quantum-orange' :
                        'border-red-400 text-red-400'
                      }`}>
                        {exchange.latency}ms
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-mono text-quantum-blue/70">Status</span>
                      <div className="flex items-center space-x-1">
                        <div className="status-indicator status-active" />
                        <span className="text-xs font-mono text-quantum-green">
                          STREAMING
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-sm font-mono text-red-400">
                      Connection Failed
                    </div>
                    <button className="text-xs font-mono text-quantum-blue hover:text-quantum-blue/80 mt-2">
                      Retry Connection
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Feed Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-morphism p-4"
      >
        <h3 className="text-lg font-heading font-semibold text-quantum-blue mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Feed Statistics</span>
        </h3>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-mono text-quantum-green">
              {exchanges.filter(ex => ex.status === 'connected').length}
            </div>
            <div className="text-xs font-mono text-quantum-blue/70">
              Active Feeds
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono text-quantum-blue">
              {Math.round(exchanges
                .filter(ex => ex.status === 'connected')
                .reduce((sum, ex) => sum + ex.latency, 0) / 
                exchanges.filter(ex => ex.status === 'connected').length) || 0}ms
            </div>
            <div className="text-xs font-mono text-quantum-blue/70">
              Avg Latency
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono text-quantum-purple">
              99.7%
            </div>
            <div className="text-xs font-mono text-quantum-blue/70">
              Uptime
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-mono text-quantum-orange">
              2.8B
            </div>
            <div className="text-xs font-mono text-quantum-blue/70">
              Total Volume
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}