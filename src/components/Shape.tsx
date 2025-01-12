/*  This React Three Fiber component renders a 3d shape that represents
    a Module (Datasource / Instrument) in the interface.
*/

import './Shape.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Mesh, Vector3, Euler } from 'three';
import { useSpring, animated } from '@react-spring/three';
import { DragControls, Html } from '@react-three/drei';
import { Module } from '../App';
import ControlsInstrument from './ControlsInstrument';
import ControlsDatasource from './ControlsDatasource';
import { transport } from '../instrument';

// A property object that is passed to the Shape component
interface ShapeProps {
  module: Module;
  modules: Module[]; // state of App() containing all Modules
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  key: number; // for react component; could change during object lifetime?
}

function Shape(props: ShapeProps) {
  // This reference will give us direct access to the mesh
  // from r3f docs - "using with typescript" about null!:
  // "The exclamation mark is a non-null assertion that will let TS know that ref.current is defined when we access it in effects."
  const meshRef = useRef<Mesh>(null!);

  // States and Refs
  const state = useThree();
  const [active, setActive] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const rotationY = useRef(0);
  const rotating = useRef(true);
  let expanded = false;

  // useEffect(() => {
  //   setNonExpandedPosition(props.module.position);
  // }, [])

  // React Spring properties (Imperative API)
  // - easing animations for changes of color, size etc.
  const [springs, api] = useSpring(() => ({
    scale: 1,
    color: props.module.color,
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
    console.log(meshRef.current);
    if (expanded) {
      switch (props.module.type) {
        case 'instrument':
          console.log('Clicked on instrument (not implemented)');
          break;
        case 'trigger':
          console.log('toggling transport');
          transport.toggle(); // todo: remove
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
      color: props.module.color,
    });
  };

  // Executes on each frame render - CAREFUL: https://r3f.docs.pmnd.rs/api/hooks#useframe
  useFrame(() => {
    rotationY.current = rotationY.current - 0.02;
    if (rotating.current) {
      meshRef.current.rotation.y = rotationY.current;
    }
  });

  function cloneShape() {
    // when dragging an inactive Shape ("menu item"), set it active and create a new inactive one in its place
    if (!active) {
      setActive(true);
      props.setModules([
        ...props.modules,
        props.module.clone(props.module.position),
      ]);
    }
  }

  // JSX
  return (
    <>
      {/* This wrapping tag enables drag-and-drop by left click on the shape */}
      <DragControls
        onDragStart={() => {
          cloneShape();
        }}
      >
        <animated.mesh
          ref={meshRef}
          position={props.module.position}
          scale={springs.scale}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleLeftClick}
          onContextMenu={handleRightClick()}
        >
          <boxGeometry args={[1, 1, 1]} />
          <animated.meshStandardMaterial color={springs.color} />
          {controlsVisible ? (
            props.module.type === 'instrument' ? (
              <ControlsInstrument instrument={props.module.instrument}/>
            ) : props.module.type === 'datasource' ? (
              <ControlsDatasource />
            ) : null
          ) : null}
          {/* uncomment the following to track whether this object re-renders due to state change (import Html from drei) */}
          {/* <Html className='debug'>
            <p>Render ID {Math.random()}</p>
          </Html> */}
        </animated.mesh>
      </DragControls>
    </>
  );
}

export default Shape;
