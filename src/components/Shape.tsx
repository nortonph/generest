/*  This React Three Fiber component renders a 3d shape that represents
    a Module (Datasource / Instrument) in the interface.
*/

import './Shape.css';
import { useCallback, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { useSpring, animated } from '@react-spring/three';
import { DragControls, Html } from '@react-three/drei';
import { Module, ModuleObj, Connection } from '../App';
import ControlsInstrument from './ControlsInstrument';
import ControlsDatasource from './ControlsDatasource';

// A property object that is passed to the Shape component
interface ShapeProps {
  moduleObj: ModuleObj;
  addModule: (newModule: Module) => void;
  updateModule: (moduleObj: ModuleObj) => void;
  addConnection: (newConnection: Connection) => void;
  hotConnection: ModuleObj | undefined; // containing module that has been selected for connection (if any)
  setHotConnection: React.Dispatch<React.SetStateAction<ModuleObj | undefined>>;
  key: number;
}

function Shape(props: ShapeProps) {
  // This reference will give us direct access to the mesh
  // from r3f docs - "using with typescript" about null!:
  // "The exclamation mark is a non-null assertion that will let TS know that ref.current is defined when we access it in effects."
  const meshRef = useRef<Mesh>(null!);
  props.moduleObj.module.meshRef = meshRef;

  // States and Refs
  // const state = useThree();
  const [active, setActive] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const rotationY = useRef(0); // this is probably not needed (set on meshRef directly in useFrame)
  const rotating = useRef(true);
  let expanded = false;

  // React Spring properties (Imperative API)
  // - easing animations for changes of color, size etc.
  const [springs, api] = useSpring(() => ({
    scale: 1,
    color: props.moduleObj.module.color,
    // set different durations based on what is being animated
    config: (key) => {
      switch (key) {
        case 'scale':
          return { duration: 100 };
        case 'color':
          return { duration: 200 };
        default:
          return {};
      }
    },
  }));

  // Mouse Interface
  const handleLeftClick = () => {
    if (expanded) {
      switch (props.moduleObj.module.type) {
        case 'instrument':
          console.log('Clicked on instrument (not implemented)');
          break;
        case 'trigger':
          console.log('Clicked a trigger (not implemented)');
          break;
      }
    } else {
      // not expanded
      switch (props.moduleObj.module.type) {
        case 'instrument':
          console.log('Clicked an instrument for connection');
          // if a module has been selected for connection previously, it will be in hotConnection
          if (props.hotConnection) {
            console.log('connection is hot, connection these two: ');
            console.log(
              props.hotConnection.module,
              props.moduleObj.module.instrument
            );
            // make a new connection and add it to the list
            props.addConnection(
              new Connection(props.hotConnection.id, props.moduleObj.id)
            );
            props.setHotConnection(undefined);
          }
          break;
        case 'trigger':
          console.log('Clicked a trigger for connection (not implemented)');
          break;
        case 'datasource':
          console.log('Clicked a datasource for connection');
          props.setHotConnection(props.moduleObj);
          break;
      }
    }
  };

  const handleRightClick = useCallback(() => {
    return () => {
      if (!active) return null;
      expanded = !expanded;
      // rotating.current = !expanded;
      setControlsVisible(expanded);
      api.start({
        scale: expanded ? 7 : 1,
      });
    };
  }, [active]);

  const handlePointerOver = () => {
    // starts hovering
    api.start({
      color: 'thistle',
    });
  };

  const handlePointerOut = () => {
    // stops hovering
    api.start({
      color: props.moduleObj.module.color,
    });
  };

  // Executes on each frame render - CAREFUL: https://r3f.docs.pmnd.rs/api/hooks#useframe
  useFrame(() => {
    // update shape rotation
    rotationY.current = rotationY.current - 0.02;
    if (rotating.current) {
      meshRef.current.rotation.y = rotationY.current;
    }
  });

  function cloneShape() {
    // when dragging an inactive Shape ("menu item"), set it active and create a new inactive one in its place
    if (!active) {
      setActive(true);
      props.addModule(
        props.moduleObj.module.clone(props.moduleObj.module.position)
      );
    }
  }

  function updatePosition() {
    // update the absolute position of the shape in the scene (position of DragControls, which is the parent, plus initial position)
    props.moduleObj.module.worldPos = meshRef
      .current!.parent!.getWorldPosition(new Vector3())
      .add(props.moduleObj.module.position);
    props.updateModule(props.moduleObj);
  }

  // JSX
  return (
    <>
      {/* This wrapping tag enables drag-and-drop by left click on the shape */}
      <DragControls
        onDragStart={() => {
          cloneShape();
        }}
        onDrag={() => {
          updatePosition();
        }}
        onDragEnd={() => {
        }}
      >
        {/* NOTE TO LEGACY TEAM: if animated.mesh (i.e. the cube) has a direct parent other than DragControls, worldPos might not be correctly calculated! */}
        <animated.mesh
          ref={meshRef}
          position={props.moduleObj.module.position}
          scale={springs.scale}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleLeftClick}
          onContextMenu={handleRightClick()}
        >
          <boxGeometry args={[1, 1, 1]} />
          <animated.meshStandardMaterial color={springs.color} />
          {controlsVisible ? (
            props.moduleObj.module.type === 'instrument' ? (
              <ControlsInstrument
                instrument={props.moduleObj.module.instrument!}
              />
            ) : props.moduleObj.module.type === 'datasource' ? (
              <ControlsDatasource />
            ) : null
          ) : null}
          {/* uncomment the following to track whether this object re-renders due to state change (import Html from drei) */}
          {/* <Html className='debug'>
            <p>Render ID {Math.random()}</p>
            <p>worldPosX {Math.round(props.moduleObj.module.worldPos.x! * 10)/10}</p>
            <p>worldPosY {Math.round(props.moduleObj.module.worldPos.y! * 10)/10}</p>
            <p>worldPosZ {Math.round(props.moduleObj.module.worldPos.z! * 10)/10}</p>
          </Html> */}
        </animated.mesh>
      </DragControls>
    </>
  );
}

export default Shape;
