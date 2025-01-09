import './App.css';
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import Thing from './components/Thing.tsx';

function App() {

  // States
  const [instruments, setInstruments] = useState([]);

  // JSX
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 40 }}>
      <Environment />
      <Thing color='orange' position={new Vector3(0, 0, 0)}></Thing>
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
