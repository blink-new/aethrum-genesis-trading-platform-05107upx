import { AethrumShell } from './components/AethrumShell'
import { SocketProvider } from './context/SocketContext'
import { AssetProvider } from './context/AssetContext'

function App() {
  return (
    <SocketProvider>
      <AssetProvider>
        <AethrumShell />
      </AssetProvider>
    </SocketProvider>
  )
}

export default App