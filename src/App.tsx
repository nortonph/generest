import './App.css';
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import Thing from './components/Thing.tsx';

class Instrument {
  color: string;
  position: Vector3;
  constructor(color: string, position: Vector3) {
    this.color = color;
    this.position = position;
  }
}

function App() {
  // States
  const [instruments, setInstruments] = useState<Instrument[]>([]);

  // "Menu items"
  function createThings() {
    const beatBox = new Instrument('orange', new Vector3(-2, 0, 0));
    const melodyBox = new Instrument('royalblue', new Vector3(2, 0, 0));
    setInstruments([beatBox, melodyBox]);
  }
  useEffect(() => {
    createThings();
  }, []);

  // JSX
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 40 }}>
      <Environment />
        {
          instruments.length ? instruments.map((instrument, idx) => {
            return (<Thing color={instrument.color} position={instrument.position}></Thing>);
          }) : <p>No instruments found.</p>
        }
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
