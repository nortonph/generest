import './App.css';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import Instrument from './components/Instrument';
import MyComponent from './components/tmp';

function App() {

  // JSX
  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
      <Environment />
      <Instrument color='orange' position={new Vector3(0, 0, 0)}></Instrument>
    </Canvas>
  );
}

// Component for lighting, etc.
function Environment() {
  const dirLightPos = new Vector3(5, 2, 5);

  // JSX
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

export default App;