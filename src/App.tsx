import './App.css';
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import Shape from './components/Shape.tsx';

export class Module {
  type: string;
  color: string;
  position: Vector3;
  constructor(type: string, position: Vector3) {
    this.type = type;
    this.position = position;
    switch (type) {
      case 'beatBox':
        this.color = 'orange'; break;
      case 'melodyBox':
        this.color = 'royalblue'; break;
      default:
        this.color = 'white';
    }
  }
}

function App() {
  // States
  const [modules, setModules] = useState<Module[]>([]);

  // "Menu items"
  function createShapes() {
    const beatBox = new Module('beatBox', new Vector3(-2, 6, 0));
    const melodyBox = new Module('melodyBox', new Vector3(2, 6, 0));
    setModules([beatBox, melodyBox]);
  }
  useEffect(() => {
    createShapes();
  }, []);

  // JSX
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 40 }}>
      <Environment />
      {modules.length ? (
        modules.map((module, idx) => {
          return (
            <Shape
              type={module.type}
              color={module.color}
              position={module.position}
              modules={modules}
              setModules={setModules}
            ></Shape>
          );
        })
      ) : (
        <p>No instruments found.</p>
      )}
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
      <mesh position={dirLightPos} visible={false} /* DEBUG */>
        <boxGeometry />
      </mesh>
    </>
  );
}

export default App;
