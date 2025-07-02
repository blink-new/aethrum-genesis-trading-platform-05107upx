import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AssetContextType {
  selectedAsset: string;
  setSelectedAsset: (asset: string) => void;
  assetPrice: number;
  setAssetPrice: (price: number) => void;
  assetChange: number;
  setAssetChange: (change: number) => void;
  assetExchange: string;
  setAssetExchange: (exchange: string) => void;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const useAsset = () => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAsset must be used within an AssetProvider');
  }
  return context;
};

interface AssetProviderProps {
  children: ReactNode;
}

export const AssetProvider: React.FC<AssetProviderProps> = ({ children }) => {
  const [selectedAsset, setSelectedAsset] = useState('BTC/USDT');
  const [assetPrice, setAssetPrice] = useState(97234.56);
  const [assetChange, setAssetChange] = useState(1.23);
  const [assetExchange, setAssetExchange] = useState('Binance');

  return (
    <AssetContext.Provider
      value={{
        selectedAsset,
        setSelectedAsset,
        assetPrice,
        setAssetPrice,
        assetChange,
        setAssetChange,
        assetExchange,
        setAssetExchange,
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};
