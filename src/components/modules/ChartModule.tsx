import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  TooltipItem,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';
import { useSocket } from '../../context/SocketContext';
import { useAsset } from '../../context/AssetContext';
import { Minimize2, Settings, BarChart3, RotateCcw, Expand, Clock, TrendingUp, TrendingDown } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

interface TradingChartProps {
  timeframe: string;
  chartType: string;
}

const TradingChart: React.FC<TradingChartProps> = ({ timeframe, chartType }) => {
  const chartRef = useRef<ChartJS>(null);
  const { indicators, isConnected, priceHistory } = useSocket();
  const { selectedAsset, assetPrice, assetChange, assetExchange } = useAsset();
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVolume, setShowVolume] = useState(true);
  const [candleCountdown, setCandleCountdown] = useState(60);

  const getTimeframeSeconds = (tf: string) => {
    const timeframes: Record<string, number> = {
      '1m': 60, '3m': 180, '5m': 300, '15m': 900, '30m': 1800,
      '1h': 3600, '2h': 7200, '4h': 14400, '6h': 21600, '12h': 43200,
      '1d': 86400, '3d': 259200, '1w': 604800, '1M': 2592000
    };
    return timeframes[tf] || 60;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCandleCountdown(prev => {
        if (prev <= 1) {
          return getTimeframeSeconds(timeframe);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeframe]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const candlestickPlugin = useMemo(() => ({
    id: 'candlestick',
    beforeDatasetsDraw: (chart: ChartJS) => {
      if (chartType !== 'candlestick' || !priceHistory.length) return;
      
      try {
        const ctx = chart.ctx;
        const meta = chart.getDatasetMeta(0);
        
        if (!meta || !meta.data || !Array.isArray(meta.data)) {
          return;
        }
        
        priceHistory.forEach((candle, index) => {
          if (!meta.data[index] || typeof meta.data[index].x === 'undefined') {
            return;
          }
          
          const x = meta.data[index].x;
          const yScale = chart.scales.y;
          
          if (!yScale || typeof yScale.getPixelForValue !== 'function') {
            return;
          }
          
          const openY = yScale.getPixelForValue(candle.o);
          const closeY = yScale.getPixelForValue(candle.c);
          const highY = yScale.getPixelForValue(candle.h);
          const lowY = yScale.getPixelForValue(candle.l);
          
          const isGreen = candle.c >= candle.o;
          const color = isGreen ? '#10b981' : '#ef4444';
          const borderColor = isGreen ? '#059669' : '#dc2626';
          
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 2; // Thicker wick
          ctx.beginPath();
          ctx.moveTo(x, highY);
          ctx.lineTo(x, lowY);
          ctx.stroke();
          
          const bodyHeight = Math.abs(closeY - openY);
          const bodyWidth = Math.max(12, chart.width / priceHistory.length * 0.8); // Dynamic width
          
          ctx.fillStyle = color;
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 1;
          
          if (bodyHeight < 2) {
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x - bodyWidth/2, openY);
            ctx.lineTo(x + bodyWidth/2, openY);
            ctx.stroke();
          } else {
            ctx.fillRect(x - bodyWidth/2, Math.min(openY, closeY), bodyWidth, bodyHeight);
            ctx.strokeRect(x - bodyWidth/2, Math.min(openY, closeY), bodyWidth, bodyHeight);
          }
        });
      } catch (err: unknown) {
        console.warn('Candlestick plugin error:', err);
      }
    }
  }), [chartType, priceHistory]);

  useEffect(() => {
    const datasets = [];
    
    if (chartType === 'candlestick') {
      datasets.push({
        label: selectedAsset,
        data: priceHistory.map(candle => ({
          x: candle.time.getTime(),
          y: candle.c, // Use close price for positioning
        })),
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        pointRadius: 0,
        showLine: false,
      });
    } else {
      datasets.push({
        label: selectedAsset,
        data: priceHistory.map(candle => ({
          x: candle.time.getTime(),
          y: candle.c,
        })),
        borderColor: '#06b6d4',
        backgroundColor: chartType === 'area' ? 'rgba(6, 182, 212, 0.1)' : 'transparent',
        borderWidth: 2,
        fill: chartType === 'area',
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 4,
      });
    }
    
    if (showVolume) {
      datasets.push({
        label: 'Volume',
        data: priceHistory.map(candle => ({
          x: candle.time.getTime(),
          y: candle.v,
        })),
        backgroundColor: priceHistory.map(candle => 
          candle.c >= candle.o ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'
        ),
        borderColor: 'transparent',
        borderWidth: 0,
        type: 'bar' as const,
        yAxisID: 'volume',
        order: 2,
        barThickness: 'flex' as const,
      });
    }
    
    indicators.forEach((indicator, index) => {
      const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'];
      datasets.push({
        label: indicator.name,
        data: priceHistory.map((candle, idx) => ({
          x: candle.time.getTime(),
          y: candle.c + Math.sin(idx * 0.1 + index) * (candle.c * 0.02), // Static calculation
        })),
        borderColor: colors[index % colors.length],
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1,
        type: 'line' as const,
      });
    });
    
    setChartData({ datasets });
  }, [selectedAsset, timeframe, chartType, indicators, showVolume, priceHistory]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: timeframe.includes('m') ? 'minute' : 
                timeframe.includes('h') ? 'hour' : 'day' as const,
          displayFormats: {
            minute: 'HH:mm',
            hour: 'MMM dd HH:mm',
            day: 'MMM dd',
          },
        },
        grid: {
          color: 'rgba(56, 178, 172, 0.1)',
          drawOnChartArea: true,
        },
        ticks: {
          color: '#9ca3af',
          maxTicksLimit: 10,
        },
      },
      y: {
        position: 'right' as const,
        grid: {
          color: 'rgba(56, 178, 172, 0.1)',
          drawOnChartArea: true,
        },
        ticks: {
          color: '#9ca3af',
          callback: function(value: number) {
            return '$' + value.toLocaleString(undefined, { 
              minimumFractionDigits: 0, 
              maximumFractionDigits: 0 
            });
          },
        },
      },
      volume: showVolume ? {
        type: 'linear' as const,
        position: 'left' as const,
        grid: {
          display: false,
        },
        ticks: {
          color: '#9ca3af',
          callback: function(value: number) {
            return (value / 1000).toFixed(1) + 'K';
          },
        },
        display: showVolume,
      } : undefined,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#38b2f6',
        bodyColor: '#e2e8f0',
        borderColor: '#38b2f6',
        borderWidth: 1,
        displayColors: true,
        callbacks: {
          title: function(context: TooltipItem<'line'>[]) {
            return new Date(context[0].parsed.x).toLocaleString();
          },
          label: function(context: TooltipItem<'line'>) {
            const datasetLabel = context.dataset.label;
            const dataIndex = context.dataIndex;
            
            if (datasetLabel === 'Volume') {
              return `Volume: ${context.parsed.y.toLocaleString()}`;
            }
            
            if (datasetLabel === selectedAsset && chartType === 'candlestick' && priceHistory[dataIndex]) {
              const candle = priceHistory[dataIndex];
              return [
                `Open: $${candle.o.toLocaleString()}`,
                `High: $${candle.h.toLocaleString()}`,
                `Low: $${candle.l.toLocaleString()}`,
                `Close: $${candle.c.toLocaleString()}`,
              ];
            }
            
            return `${datasetLabel}: $${context.parsed.y.toLocaleString()}`;
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x' as const,
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy' as const, // allow zoom in both directions
          speed: 0.1,
        },
      },
    },
    animation: {
      duration: 0,
    },
  };

  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  useEffect(() => {
    ChartJS.register(candlestickPlugin);
    return () => {
      try {
        ChartJS.unregister(candlestickPlugin);
      } catch (err: unknown) {
        console.warn('Candlestick plugin cleanup error:', err); // Log the error during cleanup
      }
    };
  }, [candlestickPlugin]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={`relative glass rounded-lg overflow-hidden ${
        isFullscreen ? 'fixed inset-4 z-50' : 'h-full'
      }`}
    >
      {/* Chart Header - VOLLSTÄNDIG TRANSPORTIERTE ASSET-DATEN! */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass border-b border-teal-800/30 p-3 flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <span className="text-sm font-medium">{selectedAsset}</span>
                  <span className="text-xs text-gray-400">{timeframe}</span>
                  <span className="text-xs text-blue-400 border-l border-gray-600 pl-2">{assetExchange}</span>
                </div>
                <span className="text-lg font-bold text-green-400">
                  ${assetPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <div className={`text-sm ${assetChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <>
                    {assetChange >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <React.Fragment>
                      <span className="font-mono">
                        {assetPrice === 0 ? '...' : `${assetChange >= 0 ? '+' : ''}${assetChange.toFixed(2)}%`}
                      </span>
                    </React.Fragment>
                  </>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* 🎯 GEÄNDERT: LAUTSPRECHERSYMBOL ZU SÄULENSYMBOL (BarChart3) */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowVolume(!showVolume)}
                  className={`glass-hover p-2 rounded text-gray-400 hover:text-teal-400 border border-teal-400/30 ${showVolume ? 'bg-teal-500/20 text-teal-400' : ''}`}
                  title="Toggle Volume (Säulen anzeigen/ausblenden)"
                >
                  <BarChart3 className="w-4 h-4" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetZoom}
                  className="glass-hover p-2 rounded text-gray-400 hover:text-teal-400 border border-teal-400/30"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-4 h-4" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="glass-hover p-2 rounded text-gray-400 hover:text-teal-400 border border-teal-400/30"
                  title="Chart Settings"
                >
                  <Settings className="w-4 h-4" />
                </motion.button>

                {/* 🎯 NEU: VOLLBILD-MODUS BUTTON */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="glass-hover p-2 rounded text-gray-400 hover:text-purple-400 border border-purple-400/30"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Mode'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Expand className="w-4 h-4" />}
                </motion.button>

                {/* 🎯 NEU: NEXT CANDLE COUNTDOWN - OHNE TEXT, NUR ICON + COUNTDOWN */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", bounce: 0.4 }}
                  className="glass px-2 py-2 rounded-lg flex items-center space-x-1 border border-teal-400/30"
                >
                  <Clock className="w-4 h-4 text-teal-400" />
                  <div className="text-sm font-mono text-teal-400 animate-pulse">
                    {formatCountdown(candleCountdown)}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chart Canvas */}
      <div className="relative h-full p-4">
        {chartData ? (
          <Chart
            ref={chartRef}
            type="line"
            data={chartData}
            options={options}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full"
            
            />
          </div>
        )}

        {/* Chart Stats Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute top-4 left-4 glass px-3 py-2 rounded-lg"
        >
          <div className="text-xs text-gray-400 mb-1">24h Stats</div>
          <div className="space-y-1">
            <div className="text-xs">High: <span className="text-green-400">${(assetPrice * 1.02).toFixed(2)}</span></div>
            <div className="text-xs">Low: <span className="text-red-400">${(assetPrice * 0.98).toFixed(2)}</span></div>
            <div className="text-xs">Vol: <span className="text-blue-400">2.4M {selectedAsset.split('/')[0]}</span></div>
          </div>
        </motion.div>

        {/* Chart Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-4 left-4 text-xs text-gray-500"
        >
          <div>Scroll to zoom • Ctrl+Drag to pan</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TradingChart;