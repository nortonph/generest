import './App.css';
import { Canvas, useFrame } from '@react-three/fiber';
import Instrument from './components/Instrument';

function Environment() {
  // component for lighting, etc.
  return (
    <>
      <ambientLight intensity={1.0} />
      <directionalLight color='orange' position={[3, 0, 3]} />
      <mesh position={[3, 0, 3]} /* DEBUG */>
        <boxGeometry />
      </mesh>
    </>
  );
}

function App() {
  return (
    <Canvas>
      <Environment />
      <Instrument color='orange'></Instrument>
    </Canvas>
  );
}

export default App;
