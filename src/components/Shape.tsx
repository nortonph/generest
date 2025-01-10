/*  This React Three Fiber component renders a 3d shape that represents
    a Module (Datasource / Instrument) in the interface.
*/

import { useCallback, useRef, useState, useEffect } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { useSpring, animated } from '@react-spring/three';
import { DragControls } from '@react-three/drei';
import * as Tone from 'tone';
import { Module } from '../App';
import { playInstrument } from '../instrument';

// A property object that is passed to the Shape component
interface ShapeProps {
  type: string;
  color: string;
  position: Vector3;
  object: Tone.Synth | undefined; // todo: this is a placeholder?
  modules: Module[]; // state of App() containing all
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
} // todo: move to type definition file

function Shape(props: ShapeProps) {
  // This reference will give us direct access to the mesh
  // from r3f docs - "using with typescript" about null!:
  // "The exclamation mark is a non-null assertion that will let TS know that ref.current is defined when we access it in effects."
  const meshRef = useRef<Mesh>(null!);

  // States and Refs
  const [active, setActive] = useState(false);
  const rotating = useRef(true);
  const expanded = useRef(false);
  const dragLimits = useRef<
    [
      [number, number] | undefined,
      [number, number] | undefined,
      [number, number] | undefined
    ]
  >([undefined, undefined, undefined]); // to disable dragging while expanded

  // todo: this is for debugging. for some reason dragLimits does not seem to be triggering useEffect (may be the reason why it doesn't reach <DragControls>)
  useEffect(() => {
    console.log(dragLimits.current);
    console.log(expanded.current);
  }, [dragLimits, expanded]);

  // React Spring properties (Imperative API)
  // - easing animations for changes of color, size etc.
  const [springs, api] = useSpring(() => ({
    scale: 1,
    color: props.color,
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
    if (expanded.current) {
      switch (props.type) {
        case 'trigger':
          console.log('trying to play sound on ' + props.type);
          playInstrument(props.object);
          break;
      }
    }
  };

  const handleRightClick = useCallback(() => {
    return (event: ThreeEvent<MouseEvent>) => {
      event.nativeEvent.preventDefault();
      expanded.current = !expanded.current;
      rotating.current = !expanded.current;
      if (expanded.current) {
        dragLimits.current = [
          [0, 0],
          [0, 0],
          [0, 0],
        ];
      } else {
        dragLimits.current = [undefined, undefined, undefined];
      }
      api.start({
        scale: expanded.current ? 1.3 : 1,
      });
    };
  }, []);

  const handlePointerOver = () => {
    // starts hovering
    api.start({
      color: 'thistle',
    });
  };

  const handlePointerOut = () => {
    // stops hovering
    api.start({
      color: props.color,
    });
  };

  // Executes on each frame render - CAREFUL: https://r3f.docs.pmnd.rs/api/hooks#useframe
  useFrame(() => {
    if (rotating.current) {
      meshRef.current.rotation.y = meshRef.current.rotation.y -= 0.02;
    }
  });

  function cloneShape() {
    // when dragging an inactive Shape ("menu item"), set it active and create a new inactive one in its place
    if (!active) {
      setActive(true);
      props.setModules([
        ...props.modules,
        new Module(props.type, meshRef.current.position, props.object),
      ]);
    }
  }

  // JSX
  return (
    <>
      {/* This wrapping tag enables drag-and-drop by left click on the shape */}
      <DragControls
        dragLimits={dragLimits.current} // todo: WHY DOESN'T THIS UPDATE? Alternative solution: have a draggable and a non-draggable holding component
        onDragStart={() => {
          cloneShape();
        }}
      >
        <animated.mesh
          ref={meshRef}
          position={props.position}
          scale={springs.scale}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onClick={handleLeftClick}
          onContextMenu={handleRightClick()}
        >
          <boxGeometry args={[1, 1, 1]} />
          <animated.meshStandardMaterial color={springs.color} />
          {/* uncomment the following to track whether this object re-renders due to state change (import Html from drei) */}
          {/* <Html><p style={{color: 'white'}}>Render ID – {Math.random()}</p></Html> */}
        </animated.mesh>
      </DragControls>
    </>
  );
}

export default Shape;
