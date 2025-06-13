/** generest
 * generative music playground using public APIs as input
 *
 * Solo project for codeworks
 * Philipp Norton, 2025
 */

import './App.css';
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Vector3 } from 'three';
import Shape from './components/Shape.tsx';
import Line from './components/Line.tsx';
import Environment from './components/Environment.tsx';
import { Instrument, transport } from './instrument.tsx';
import { Datasource } from './datasource.tsx';
import { Module, ModuleObj } from './models/module.ts';
import { Connection, ConnectionObj } from './models/connection.ts';

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
      'datasource',
      new Vector3(-3, 6, 0),
      undefined,
      new Datasource()
    );
    const instrument = new Module(
      'instrument',
      new Vector3(3, 6, 0),
      new Instrument(),
      undefined
    );
    addModule(datasource);
    addModule(instrument);
    // todo: do this dynamically when interacting with the datasource controls
    const yesterday = new Date(Date.now());
    yesterday.setDate(yesterday.getDate() - 1);
    datasource.datasource?.getFullDay(yesterday);
  }

  // create the "menu" shapes (ensure that this only runs once)
  if (modules.length === 0) {
    createShapes();
    console.log('createShapes called');
  }

  // start main time component of Tone.js
  const handleStart = () => {
    transport.start();
    // loop through instruments and stop them
    modules.forEach((m) => {
      if (m.module.type === 'instrument') m.module.instrument?.playSequence();
    });
  };
  const handleStop = () => {
    transport.stop();
    // loop through instruments and stop them
    modules.forEach((m) => {
      if (m.module.type === 'instrument') m.module.instrument?.stopSequence();
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
    console.log('in App: modules updated');
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

  function removeConnection(connectionObj: ConnectionObj): void {
    // update the state (list of connection objects in App.tsx) with changes made to connectionObj
    setConnections((existingConnections) => {
      console.log('removeConnection() called');
      const updatedConnections = [...existingConnections];
      const iConn = updatedConnections.indexOf(connectionObj);
      if (iConn > -1) {
        updatedConnections.splice(iConn, 1);
      }
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
                    removeConnection={removeConnection}
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

export default App;
