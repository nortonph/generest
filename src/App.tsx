import './App.css';
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import Shape from './components/Shape.tsx';
import { Instrument, transport } from './instrument.tsx';

// A Module can be an instrument, an online data source (API) or another trigger,
// each represented by a 3d shape in the interface.
export class Module {
  // todo: put this in a different file?
  type: string;
  color: string;
  position: Vector3;
  object: Instrument | undefined;
  constructor(type: string, position: Vector3, object: Instrument | undefined) {
    this.type = type;
    this.position = position;
    this.object = object;
    switch (type) {
      case 'source':
        this.color = 'royalblue';
        break;
      case 'trigger':
        this.color = 'hotpink';
        break;
      case 'instrument':
        this.color = 'orange';
        break;
      default:
        this.color = 'white';
    }
  }
}

function App() {
  // States
  const [modules, setModules] = useState<Module[]>([]);

  // "Menu items" (i.e. one static instance of each module that can be cloned
  //  and activated by dragging it into the interface area)
  function createShapes() {
    const source = new Module('source', new Vector3(-3, 6, 0), undefined);
    const trigger = new Module(
      'trigger',
      new Vector3(0, 6, 0),
      undefined
    );
    const instrument = new Module(
      'instrument',
      new Vector3(3, 6, 0),
      new Instrument(),
    );
    setModules([source, trigger, instrument]);
  }
  useEffect(() => {
    createShapes();
  }, []);

  // JSX
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 40 }}>
      <Environment />
      {modules.length ? (
        modules.map((module) => {
          return (
            <Shape
              type={module.type} // todo: pass whole module as one prop?
              color={module.color}
              position={module.position}
              object={module.object}
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
