import React, { createContext, useContext, useEffect, useState } from 'react';

interface CandleData {
  time: Date;
  price: number;
  volume: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

interface IndicatorData {
  name: string;
  type: string;
  data: Record<string, unknown>;
}

interface SocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  lastPrice: number;
  priceHistory: CandleData[];
  indicators: IndicatorData[];
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws/btcusdt@kline_1m';

const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastPrice, setLastPrice] = useState(0);
  const [priceHistory, setPriceHistory] = useState<CandleData[]>([]);
  const [indicators, setIndicators] = useState<IndicatorData[]>([]);

  useEffect(() => {
    const ws = new WebSocket(BINANCE_WS_URL);
    setSocket(ws);

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.k) {
          const candle = {
            time: new Date(data.k.t),
            price: parseFloat(data.k.c),
            volume: parseFloat(data.k.v),
            o: parseFloat(data.k.o),
            h: parseFloat(data.k.h),
            l: parseFloat(data.k.l),
            c: parseFloat(data.k.c),
            v: parseFloat(data.k.v),
          };
          setLastPrice(candle.c);
          setPriceHistory((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.time.getTime() === candle.time.getTime()) {
              return [...prev.slice(0, -1), candle];
            } else {
              return [...prev, candle].slice(-200);
            }
          });
        }
      } catch {
        // Ignore parse errors
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    ws.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const indicatorTimeout = setTimeout(() => {
      setIndicators([
        { name: 'RSI (14)', type: 'RSI', data: { value: 65.4 } },
        { name: 'MACD', type: 'MACD', data: { macd: 234.5, signal: 189.2, histogram: 45.3 } },
      ]);
    }, 5000);

    return () => {
      clearTimeout(indicatorTimeout);
    };
  }, []);

  const value = React.useMemo(() => ({
    socket,
    isConnected,
    lastPrice,
    priceHistory,
    indicators,
  }), [socket, isConnected, lastPrice, priceHistory, indicators]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export { SocketProvider };
export default SocketProvider;