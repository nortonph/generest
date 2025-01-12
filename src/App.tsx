import './App.css';
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import Shape from './components/Shape.tsx';
import { Instrument, transport } from './instrument.tsx';
import { Datasource } from './datasource.tsx';

// A Module can be an instrument, an online data source (API) or another trigger,
// each represented by a 3d shape in the interface.
export class Module {
  // todo: put this in a different file?
  type: string;
  color: string;
  position: Vector3;
  instrument: Instrument | undefined;
  datasource: Datasource | undefined;
  constructor(
    type: string,
    position: Vector3,
    instrument: Instrument | undefined,
    datasource: Datasource | undefined
  ) {
    this.type = type;
    this.position = position;
    this.instrument = instrument;
    this.datasource = datasource;
    switch (type) {
      case 'datasource':
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
  clone(position: Vector3) {
    return new Module(this.type, position, this.instrument, this.datasource);
  }
}

function App() {
  // States
  const [modules, setModules] = useState<Module[]>([]);

  // "Menu items" (i.e. one static instance of each module that can be cloned
  //  and activated by dragging it into the interface area)
  function createShapes() {
    const datasource = new Module(
      'datasource',
      new Vector3(-3, 6, 0),
      undefined,
      new Datasource()
    );
    const trigger = new Module(
      'trigger',
      new Vector3(0, 6, 0),
      undefined,
      undefined
    );
    const instrument = new Module(
      'instrument',
      new Vector3(3, 6, 0),
      new Instrument(),
      undefined
    );
    setModules([datasource, trigger, instrument]);
    // todo: remove
    const yesterday = new Date(Date.now());
    yesterday.setDate(yesterday.getDate() - 1);
    datasource.datasource?.getFullDay(yesterday);
  }
  useEffect(() => {
    createShapes();
  }, []);

  const handleStart = () => {
    transport.start();
  }

  // JSX
  return (
    <>
      <button onClick={handleStart}>start</button>
      <span onContextMenu={(e) => e.nativeEvent.preventDefault()}>
        <Canvas camera={{ position: [0, 0, 20], fov: 40 }}>
          <Environment />
          {modules.length ? (
            modules.map((module, idx) => {
              return (
                <Shape
                  module={module}
                  modules={modules}
                  setModules={setModules}
                  key={idx}
                ></Shape>
              );
            })
          ) : (
            <p>No instruments found.</p>
          )}
        </Canvas>
      </span>
    </>
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
