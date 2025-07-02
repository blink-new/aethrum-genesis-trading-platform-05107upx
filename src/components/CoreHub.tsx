import { motion } from 'framer-motion'
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import TradingChart from './modules/ChartModule' // Changed import
import { ExchangeModule } from './modules/ExchangeModule'
import { IndicatorsModule } from './modules/IndicatorsModule'
import { BotsModule } from './modules/BotsModule'
import { ScriptsModule } from './modules/ScriptsModule'
import { DashboardsModule } from './modules/DashboardsModule'
import { PythonAppsModule } from './modules/PythonAppsModule'
import { TemplatesModule } from './modules/TemplatesModule'
import { APIModule } from './modules/APIModule'
import { SocketProvider } from '../context/SocketContext' // Changed to named import
import { AssetProvider } from '../context/AssetContext'   // Added AssetProvider
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select' // Added Select components
import { 
  BarChart3, 
  Shuffle, 
  TrendingUp, 
  Bot, 
  Code, 
  LayoutDashboard, 
  Brain, 
  Bookmark,
  Settings,
  Maximize,
  Download,
  Mic
} from 'lucide-react'

const moduleConfig = [
  { id: 'chart', label: 'Quantum Chart', icon: BarChart3, component: TradingChart }, // Changed component
  { id: 'exchanges', label: 'Feed Nexus', icon: Shuffle, component: ExchangeModule },
  { id: 'indicators', label: 'Indicators', icon: TrendingUp, component: IndicatorsModule },
  { id: 'bots', label: 'Bots', icon: Bot, component: BotsModule },
  { id: 'scripts', label: 'Scripts', icon: Code, component: ScriptsModule },
  { id: 'dashboards', label: 'Dashboards', icon: LayoutDashboard, component: DashboardsModule },
  { id: 'python', label: 'Python Apps', icon: Brain, component: PythonAppsModule },
  { id: 'templates', label: 'Templates', icon: Bookmark, component: TemplatesModule },
  { id: 'api', label: 'API Gateway', icon: Settings, component: APIModule }
]

const powerTools = [
  { id: 'fullscreen', label: 'Fullscreen', icon: Maximize },
  { id: 'export', label: 'Export', icon: Download },
  { id: 'voice', label: 'Neural Voice', icon: Mic }
]

const timeframes = [
  { value: '1m', label: '1 Minute' },
  { value: '5m', label: '5 Minutes' },
  { value: '15m', label: '15 Minutes' },
  { value: '30m', label: '30 Minutes' },
  { value: '1h', label: '1 Hour' },
  { value: '4h', label: '4 Hours' },
  { value: '1d', label: '1 Day' },
  { value: '1w', label: '1 Week' },
];

export function CoreHub() {
  const [activeModule, setActiveModule] = useState('chart')
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('1m'); // New state for timeframe

  const handlePowerTool = (toolId: string) => {
    switch (toolId) {
      case 'fullscreen':
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          document.documentElement.requestFullscreen()
        }
        break
      case 'voice':
        setIsVoiceActive(!isVoiceActive)
        // Voice command implementation would go here
        break
      case 'export':
        // Export functionality would go here
        break
    }
  }

  return (
    <div className="w-full h-full flex">
      {/* Left Sidebar - Module Navigation */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 h-full glass-morphism border-r border-quantum-blue/20 p-4"
      >
        {/* Module Hub Title */}
        <div className="mb-6">
          <h2 className="text-lg font-heading font-bold text-quantum-blue hologram-text">
            AION MODULE HUB
          </h2>
          <div className="text-xs font-mono text-quantum-blue/60 mt-1">
            Neural Interface v12.0
          </div>
        </div>

        {/* Module Navigation */}
        <Tabs value={activeModule} onValueChange={setActiveModule} orientation="vertical" className="space-y-1">
          <TabsList className="bg-transparent flex-col h-auto space-y-1 w-full">
            {moduleConfig.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="w-full"
              >
                <TabsTrigger
                  value={module.id}
                  className="w-full justify-start module-tab text-left p-3 space-x-3 data-[state=active]:bg-quantum-blue/10"
                >
                  <module.icon className="w-4 h-4 text-quantum-blue" />
                  <span className="text-sm font-mono">{module.label}</span>
                  {activeModule === module.id && (
                    <motion.div
                      layoutId="activeModule"
                      className="absolute left-0 w-1 h-8 bg-quantum-blue rounded-r"
                    />
                  )}
                </TabsTrigger>
              </motion.div>
            ))}
          </TabsList>
        </Tabs>

        {/* Power Tools */}
        <div className="mt-8 pt-6 border-t border-quantum-blue/20">
          <h3 className="text-sm font-heading font-semibold text-quantum-blue/80 mb-3">
            POWER TOOLS
          </h3>
          <div className="space-y-2">
            {powerTools.map((tool, index) => (
              <motion.button
                key={tool.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                onClick={() => handlePowerTool(tool.id)}
                className={`w-full quantum-button text-left p-3 space-x-2 flex items-center text-sm ${
                  tool.id === 'voice' && isVoiceActive ? 'bg-quantum-green/20 border-quantum-green/40' : ''
                }`}
              >
                <tool.icon className={`w-4 h-4 ${
                  tool.id === 'voice' && isVoiceActive ? 'text-quantum-green' : 'text-quantum-blue'
                }`} />
                <span className="font-mono">{tool.label}</span>
                {tool.id === 'voice' && isVoiceActive && (
                  <div className="ml-auto">
                    <div className="status-indicator status-active" />
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="mt-auto pt-6">
          <div className="text-xs font-mono text-quantum-blue/40 space-y-1">
            <div>Memory: 847.2 TB</div>
            <div>Neural Cores: 8,192</div>
            <div>Quantum State: Stable</div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 h-full">
        <Tabs value={activeModule} className="w-full h-full">
          {moduleConfig.map((module) => (
            <TabsContent key={module.id} value={module.id} className="w-full h-full m-0">
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                {module.id === 'chart' ? (
                  <SocketProvider>
                    <AssetProvider>
                      <div className="flex flex-col h-full">
                        <div className="p-4 glass-morphism border-b border-quantum-blue/20 flex items-center space-x-4">
                          <span className="text-sm text-quantum-blue">Timeframe:</span>
                          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                            <SelectTrigger className="w-[120px] quantum-button">
                              <SelectValue placeholder="Select a timeframe" />
                            </SelectTrigger>
                            <SelectContent className="glass-morphism border-quantum-blue/20">
                              {timeframes.map(tf => (
                                <SelectItem key={tf.value} value={tf.value}>
                                  {tf.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <TradingChart timeframe={selectedTimeframe} chartType="candlestick" />
                      </div>
                    </AssetProvider>
                  </SocketProvider>
                ) : (
                  <module.component />
                )}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}