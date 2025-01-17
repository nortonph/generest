/** generest
 * generative music playground using public APIs as input
 *
 * Solo project for codeworks
 * Philipp Norton, 2025
 *
 * Guaranteed 100% AI free :)
 */

import "./App.css";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import Shape from "./components/Shape.tsx";
import Line from "./components/Line.tsx";
import { Instrument, transport } from "./instrument.tsx";
import { Datasource } from "./datasource.tsx";

// A Module can be an instrument, an online data source (API) or another trigger,
// each represented by a 3d shape in the interface.
export class Module {
  // todo: put classes in a different file?
  // note: position here is the original position at creation and does not change (position in the "menu")
  // worldPos is the updated position in absolute world coordinates (original position + position
  // of DragControls, the parent of the shape mesh). See updatePosition() in Shape for how this is calculated
  type: string;
  color: string;
  position: Vector3;
  worldPos: Vector3;
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
    this.worldPos = position;
    this.instrument = instrument;
    this.datasource = datasource;
    this.meshRef = undefined;
    switch (type) {
      case "datasource":
        this.color = "royalblue";
        break;
      case "trigger":
        this.color = "hotpink";
        break;
      case "instrument":
        this.color = "orange";
        break;
      default:
        this.color = "white";
    }
  }
  clone(position: Vector3) {
    if (this.type === "datasource") {
      return new Module(this.type, position, undefined, this.datasource);
    } else if (this.type === "instrument") {
      return new Module(this.type, position, new Instrument(), undefined);
    } else {
      return new Module(this.type, position, undefined, undefined);
    }
  }
}

// to track the state of modules in App.tsx, modules are wrapped in an object with numeric id
// (this can probably be refactored, it is a relatively late addition)
export interface ModuleObj {
  id: number;
  module: Module;
}

// A connection is formed between two modules, from a datasource
// (in the future maybe also from a trigger) to an instrument
export class Connection {
  fromModuleId: number; // add Trigger here later
  toModuleId: number;
  constructor(fromModuleId: number, toModuleId: number) {
    this.fromModuleId = fromModuleId;
    this.toModuleId = toModuleId;
  }
}

// to track the state of connections in App.tsx, connections are wrapped in an object with numeric id
export interface ConnectionObj {
  id: number;
  connection: Connection;
}

function App() {
  // States ###############################################
  const [modules, setModules] = useState<ModuleObj[]>([]);
  const [connections, setConnections] = useState<ConnectionObj[]>([]);
  // when the user clicks on a module to connect it to another, this state will be
  // set to the first module (datasource/instrument) in Shape.tsx, otherwise it is null
  const [hotConnection, setHotConnection] = useState<ModuleObj | undefined>(
    undefined
  );

  // "Menu items" (i.e. one static instance of each module that can be cloned
  //  and activated by dragging it into the interface area)
  function createShapes() {
    const datasource = new Module(
      "datasource",
      new Vector3(-3, 6, 0),
      undefined,
      new Datasource()
    );
    const trigger = new Module(
      "trigger",
      new Vector3(0, 6, 0),
      undefined,
      undefined
    );
    const instrument = new Module(
      "instrument",
      new Vector3(3, 6, 0),
      new Instrument(),
      undefined
    );
    addModule(datasource);
    addModule(trigger);
    addModule(instrument);
    // todo: do this dynamically when interacting with the datasource controls
    const yesterday = new Date(Date.now());
    yesterday.setDate(yesterday.getDate() - 1);
    datasource.datasource?.getFullDay(yesterday);
  }

  // create the "menu" shapes (ensure that this only runs once)
  if (modules.length === 0) {
    createShapes();
    console.log("createShapes called");
  }

  // start main time component of Tone.js
  const handleStart = () => {
    transport.start();
    // loop through instruments and stop them
    modules.forEach((m) => {
      if (m.module.type === "instrument") m.module.instrument?.playSequence();
    });
  };
  const handleStop = () => {
    transport.stop();
    // loop through instruments and stop them
    modules.forEach((m) => {
      if (m.module.type === "instrument") m.module.instrument?.stopSequence();
    });
  };

  // module & connection creation/update ###################################

  function addModule(newModule: Module): void {
    setModules((existingModules) => {
      if (!existingModules.length) return [{ id: 0, module: newModule }];
      // find highest existing id
      const maxId = existingModules.reduce((a, b) => (a.id > b.id ? a : b)).id;
      // return a list of existing modules plus the new one with id = maxId + 1
      const updatedModules = [
        ...existingModules,
        { id: maxId + 1, module: newModule },
      ];
      return updatedModules;
    });
  }

  function updateModule(moduleObj: ModuleObj): void {
    // update the state (list of module objects in App.tsx) with changes made to moduleObj
    setModules((existingModules) => {
      const updatedModules = [...existingModules];
      updatedModules[moduleObj.id].module = moduleObj.module;
      return updatedModules;
    });
    console.log("in App: modules updated");
  }

  function addConnection(newConnection: Connection): void {
    setConnections((existingConnections) => {
      if (!existingConnections.length)
        return [{ id: 0, connection: newConnection }];
      // find highest existing id
      const maxId = existingConnections.reduce((a, b) =>
        a.id > b.id ? a : b
      ).id;
      // return a list of existing connections plus the new one with id = maxId + 1
      return [
        ...existingConnections,
        { id: maxId + 1, connection: newConnection },
      ];
    });
  }

  function updateConnection(connectionObj: ConnectionObj): void {
    // update the state (list of connection objects in App.tsx) with changes made to connectionObj
    setConnections((existingConnections) => {
      const updatedConnections = [...existingConnections];
      updatedConnections[connectionObj.id].connection =
        connectionObj.connection;
      return updatedConnections;
    });
  }

  // JSX ###############################################
  return (
    <>
      <span onContextMenu={(e) => e.nativeEvent.preventDefault()}>
        <button onClick={handleStart}>start</button>
        <button onClick={handleStop}>stop</button>
        <Canvas camera={{ position: [0, 0, 20], fov: 40 }}>
          <Environment />
          {modules.length ? (
            modules.map((moduleObj) => {
              return (
                <Shape
                  moduleObj={moduleObj}
                  addModule={addModule}
                  updateModule={updateModule}
                  addConnection={addConnection}
                  hotConnection={hotConnection}
                  setHotConnection={setHotConnection}
                  key={moduleObj.id}
                ></Shape>
              );
            })
          ) : (
            <p>No modules found.</p>
          )}
          {connections.length
            ? connections.map((connectionObj) => {
                return (
                  <Line
                    connectionObj={connectionObj}
                    modules={modules}
                    key={connectionObj.id}
                  ></Line>
                );
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
      {/* <OrbitControls> */}
      <ambientLight intensity={1.0} />
      {/* directionalLight: sun; casts shadows; infinitely far w/ parallel rays */}
      {/* pointLight: light bulb */}
      <directionalLight color="white" position={dirLightPos} />
      <mesh position={dirLightPos} visible={false} /* DEBUG */>
        <boxGeometry />
      </mesh>
      {/* </OrbitControls> */}
    </>
  );
}

export default App;
