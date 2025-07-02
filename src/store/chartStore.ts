import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { ChartState, CandleData, ViewPort, Timeframe } from '../types/chart';

interface CurrentPriceData {
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface ChartStore extends ChartState {
  // Connection state
  isConnected: boolean;
  currentPrice: CurrentPriceData | null;
  
  // Actions
  setData: (data: CandleData[], resetViewport?: boolean) => void;
  setViewport: (viewport: Partial<ViewPort>) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setTimeframe: (timeframe: Timeframe) => void;
  setShowVolume: (show: boolean) => void;
  setShowGrid: (show: boolean) => void;
  resetViewport: () => void;
  zoomIn: (centerX?: number) => void;
  zoomOut: (centerX?: number) => void;
  panChart: (deltaX: number, deltaY: number) => void;
  setInteraction: (interaction: Partial<ChartState['interaction']>) => void;
  
  // Scale-specific actions
  setPriceRange: (priceRange: { min: number; max: number }) => void;
  setTimeRange: (timeRange: { start: number; end: number }) => void;
  setCandleWidth: (width: number) => void;
  
  // Loading actions
  setLoading: (loading: boolean) => void;
  setConnectionStatus: (connected: boolean) => void;
  
  // Live data actions
  addOrUpdateCandle: (candle: CandleData) => void;
  updateCurrentPrice: (priceData: CurrentPriceData) => void;
}

const calculateInitialViewport = (data: CandleData[]): ViewPort => {
  if (data.length === 0) {
    return {
      priceRange: { min: 0, max: 100 },
      timeRange: { start: Date.now() - 86400000, end: Date.now() },
      candleWidth: 8,
      spacing: 2
    };
  }

  const visibleCount = Math.min(100, data.length);
  const startIndex = Math.max(0, data.length - visibleCount);
  const visibleData = data.slice(startIndex);

  const prices = visibleData.flatMap(d => [d.open, d.high, d.low, d.close]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1;

  return {
    priceRange: { 
      min: minPrice - padding, 
      max: maxPrice + padding 
    },
    timeRange: { 
      start: visibleData[0].timestamp, 
      end: visibleData[visibleData.length - 1].timestamp 
    },
    candleWidth: 8,
    spacing: 2
  };
};

export const useChartStore = create<ChartStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    data: [],
    viewport: {
      priceRange: { min: 0, max: 100 },
      timeRange: { start: Date.now() - 86400000, end: Date.now() },
      candleWidth: 8,
      spacing: 2
    },
    theme: 'dark',
    timeframe: '1h',
    showVolume: true,
    showGrid: true,
    isLoading: false,
    isConnected: false,
    currentPrice: null,
    interaction: {
      isDragging: false,
      isZooming: false,
      lastMousePos: null,
      dragStart: null
    },

    // Actions
    setData: (data, resetViewport = false) => set((state) => {
      if (resetViewport) {
        return {
          data,
          viewport: calculateInitialViewport(data)
        };
      } else {
        return { data };
      }
    }),

    setViewport: (viewport) => set((state) => ({
      viewport: { ...state.viewport, ...viewport }
    })),

    setTheme: (theme) => set({ theme }),

    setTimeframe: (timeframe) => set({ timeframe }),

    setShowVolume: (showVolume) => set({ showVolume }),

    setShowGrid: (showGrid) => set({ showGrid }),

    setLoading: (isLoading) => set({ isLoading }),

    setConnectionStatus: (isConnected) => set({ isConnected }),

    resetViewport: () => set((state) => ({
      viewport: calculateInitialViewport(state.data)
    })),

    // Enhanced live data actions with perfect synchronization
    addOrUpdateCandle: (newCandle) => set((state) => {
      const existingIndex = state.data.findIndex(
        candle => candle.timestamp === newCandle.timestamp
      );
      
      let newData: CandleData[];
      
      if (existingIndex >= 0) {
        // Update existing candle with live data
        newData = [...state.data];
        newData[existingIndex] = newCandle;
      } else {
        // Add new candle
        newData = [...state.data, newCandle].sort((a, b) => a.timestamp - b.timestamp);
        
        // Keep only last 2000 candles for performance
        if (newData.length > 2000) {
          newData = newData.slice(-2000);
        }
      }
      
      // CRITICAL: Synchronize current price with the latest candle
      const latestCandle = newData[newData.length - 1];
      let updatedCurrentPrice = state.currentPrice;
      
      if (latestCandle && latestCandle.timestamp === newCandle.timestamp) {
        // Calculate change from previous candle for accurate display
        const previousCandle = newData[newData.length - 2];
        if (previousCandle) {
          const change = latestCandle.close - previousCandle.close;
          const changePercent = (change / previousCandle.close) * 100;
          
          updatedCurrentPrice = {
            price: latestCandle.close,
            change,
            changePercent,
            volume: latestCandle.volume
          };
        } else {
          updatedCurrentPrice = {
            price: latestCandle.close,
            change: 0,
            changePercent: 0,
            volume: latestCandle.volume
          };
        }
      }
      
      return { 
        data: newData,
        currentPrice: updatedCurrentPrice
      };
    }),

    updateCurrentPrice: (priceData) => set((state) => {
      // CRITICAL: Update both current price AND the latest candle simultaneously
      if (state.data.length > 0) {
        const newData = [...state.data];
        const latestCandle = newData[newData.length - 1];
        
        // Calculate current candle timestamp based on timeframe
        const now = Date.now();
        const timeframeMs = getTimeframeMilliseconds(state.timeframe);
        const currentCandleTimestamp = Math.floor(now / timeframeMs) * timeframeMs;
        
        // Check if we need to update the latest candle or create a new one
        if (latestCandle.timestamp === currentCandleTimestamp) {
          // Update the existing latest candle with current price
          newData[newData.length - 1] = {
            ...latestCandle,
            close: priceData.price,
            high: Math.max(latestCandle.high, priceData.price),
            low: Math.min(latestCandle.low, priceData.price),
            volume: priceData.volume || latestCandle.volume
          };
        } else if (currentCandleTimestamp > latestCandle.timestamp) {
          // Create new candle for current timeframe
          const newCandle: CandleData = {
            timestamp: currentCandleTimestamp,
            open: latestCandle.close, // Open with previous close
            high: priceData.price,
            low: priceData.price,
            close: priceData.price,
            volume: priceData.volume || 0
          };
          newData.push(newCandle);
          
          // Keep only last 2000 candles
          if (newData.length > 2000) {
            newData.splice(0, newData.length - 2000);
          }
        }
        
        return {
          currentPrice: priceData,
          data: newData
        };
      }
      
      return { currentPrice: priceData };
    }),

    // Scale-specific actions
    setPriceRange: (priceRange) => set((state) => ({
      viewport: { ...state.viewport, priceRange }
    })),

    setTimeRange: (timeRange) => set((state) => ({
      viewport: { ...state.viewport, timeRange }
    })),

    setCandleWidth: (candleWidth) => set((state) => ({
      viewport: { ...state.viewport, candleWidth }
    })),

    zoomIn: (centerX) => set((state) => {
      const { viewport, data } = state;
      
      const zoomFactor = 0.85;
      const center = centerX || (viewport.timeRange.start + viewport.timeRange.end) / 2;
      const duration = viewport.timeRange.end - viewport.timeRange.start;
      const newDuration = Math.max(duration * zoomFactor, 3600000);
      
      const dataStart = data.length > 0 ? data[0].timestamp : viewport.timeRange.start;
      const dataEnd = data.length > 0 ? data[data.length - 1].timestamp : viewport.timeRange.end;
      
      let newStart = center - newDuration / 2;
      let newEnd = center + newDuration / 2;
      
      if (newStart < dataStart) {
        newStart = dataStart;
        newEnd = newStart + newDuration;
      }
      if (newEnd > dataEnd) {
        newEnd = dataEnd;
        newStart = newEnd - newDuration;
      }
      
      return {
        viewport: {
          ...viewport,
          timeRange: {
            start: newStart,
            end: newEnd
          },
          candleWidth: Math.min(viewport.candleWidth * 1.15, 20)
        }
      };
    }),

    zoomOut: (centerX) => set((state) => {
      const { viewport, data } = state;
      
      const zoomFactor = 1.15;
      const center = centerX || (viewport.timeRange.start + viewport.timeRange.end) / 2;
      const duration = viewport.timeRange.end - viewport.timeRange.start;
      
      const dataStart = data.length > 0 ? data[0].timestamp : viewport.timeRange.start;
      const dataEnd = data.length > 0 ? data[data.length - 1].timestamp : viewport.timeRange.end;
      const maxDuration = dataEnd - dataStart;
      
      const newDuration = Math.min(duration * zoomFactor, maxDuration * 1.1);
      
      let newStart = center - newDuration / 2;
      let newEnd = center + newDuration / 2;
      
      if (newStart < dataStart - (maxDuration * 0.05)) {
        newStart = dataStart - (maxDuration * 0.05);
        newEnd = newStart + newDuration;
      }
      if (newEnd > dataEnd + (maxDuration * 0.05)) {
        newEnd = dataEnd + (maxDuration * 0.05);
        newStart = newEnd - newDuration;
      }
      
      return {
        viewport: {
          ...viewport,
          timeRange: {
            start: newStart,
            end: newEnd
          },
          candleWidth: Math.max(viewport.candleWidth * 0.85, 2)
        }
      };
    }),

    panChart: (deltaX, deltaY) => set((state) => {
      const { viewport } = state;
      const timeDelta = deltaX * (viewport.timeRange.end - viewport.timeRange.start) / 1000;
      const priceDelta = deltaY * (viewport.priceRange.max - viewport.priceRange.min) / 500;
      
      return {
        viewport: {
          ...viewport,
          timeRange: {
            start: viewport.timeRange.start - timeDelta,
            end: viewport.timeRange.end - timeDelta
          },
          priceRange: {
            min: viewport.priceRange.min + priceDelta,
            max: viewport.priceRange.max + priceDelta
          }
        }
      };
    }),

    setInteraction: (interaction) => set((state) => ({
      interaction: { ...state.interaction, ...interaction }
    }))
  }))
);

// Helper function to get timeframe in milliseconds
function getTimeframeMilliseconds(timeframe: Timeframe): number {
  const mapping = {
    '1m': 60000,
    '5m': 300000,
    '15m': 900000,
    '1h': 3600000,
    '4h': 14400000,
    '1d': 86400000
  };
  return mapping[timeframe];
}
