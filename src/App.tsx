/** generest
 * generative music playground using public APIs as input
 *
 * Solo project for codeworks
 * Philipp Norton, 2025
 *
 * Proposal:
 * Transform publicly available data into generative music. Generest allows you to make data audible by
 * selecting time-series data from public RESTful web APIs to drive and modulate pre-configured synthesized
 * instruments running in your browser. Data will be discretized to harmonic scales and rhythmic time signatures
 * to bring about a musical quality that still maps to real-life events/measurements. The input could range
 * from sensor data like the traffic volume of a city or the water level of a river to stock prices and
 * social media messages.
 *
 * Not fully implemented yet:
 * - data fetching
 * - sequence generation from data
 * - visualization of module connections
 *
 * Guaranteed 100% AI free :)
 */

import './App.css';
import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import Shape from './components/Shape.tsx';
import Line from './components/Line.tsx';
import { Instrument, transport } from './instrument.tsx';
import { Datasource } from './datasource.tsx';

// A Module can be an instrument, an online data source (API) or another trigger,
// each represented by a 3d shape in the interface.
export class Module {
  // todo: put classes in a different file?
  type: string;
  color: string;
  position: Vector3;
  instrument: Instrument | undefined;
  datasource: Datasource | undefined;
  meshRef: React.MutableRefObject<Mesh> | undefined; // reference to the Shape mesh (e.g. cube)
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
    this.meshRef = undefined;
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

// A connection is formed between two modules, from a datasource
// (in the future maybe also from a trigger) to an instrument
export class Connection {
  from: Module; // add Trigger here later
  to: Module;
  constructor(from: Module, to: Module) {
    this.from = from;
    this.to = to;
  }
}

function App() {
  // States
  const [modules, setModules] = useState<Module[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  // when the user clicks on a module to connect it to another, this state will be
  // set to the first module (datasource/instrument) in Shape.tsx, otherwise it is null
  const [hotConnection, setHotConnection] = useState<Module | undefined>(
    undefined
  );

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
  };

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
                  connections={connections}
                  setConnections={setConnections}
                  hotConnection={hotConnection}
                  setHotConnection={setHotConnection}
                  key={idx}
                ></Shape>
              );
            })
          ) : (
            <p>No modules found.</p>
          )}
          {connections.length
            ? connections.map((connection, idx) => {
                return <Line connection={connection} key={idx}></Line>;
              })
            : null}
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
