import './App.css';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import Instrument from './components/Instrument';

function Environment() {
  // component for lighting, etc.
  const dirLightPos = new Vector3(5, 2, 5);

  return (
    <>
      <ambientLight intensity={1.0} />
      {/* directionalLight: sun; casts shadows; infinitely far w/ parallel rays */}
      {/* pointLight: light bulb */}
      <directionalLight color='white' position={dirLightPos} />
      <mesh position={dirLightPos} /* DEBUG */>
        <boxGeometry />
      </mesh>
    </>
  );
}

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
      <Environment />
      <Instrument color='orange' position={new Vector3(0, 0, 0)}></Instrument>
    </Canvas>
  );
}

export default App;
