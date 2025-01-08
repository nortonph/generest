import './App.css'
import { Canvas } from '@react-three/fiber'
import Instrument from './components/Instrument'

function App() {

  return (
    <div id="canvas-container">
      {/* Canvas sets up a Scene and Camera and renders the scene every frame */}
      <Canvas>
        <Instrument></Instrument>
      </Canvas>
    </div>
  )
}

export default App
