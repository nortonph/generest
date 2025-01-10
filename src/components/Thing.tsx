import { useCallback, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, ThreeEvent } from 'three';
import { useSpring, animated } from '@react-spring/three';
import { DragControls, Html } from '@react-three/drei';
import { Module } from '../App';

interface ThingProps {
  type: string;
  color: string;
  position: Vector3;
  modules: Module[];  // state of App() containing all
  setModules: Function;
}

function Thing(props: ThingProps) {
  // This reference will give us direct access to the mesh
  // from r3f docs - "using with typescript" about null!:
  // "The exclamation mark is a non-null assertion that will let TS know that ref.current is defined when we access it in effects."
  const meshRef = useRef<Mesh>(null!);

  // States
  const [active, setActive] = useState(false);
  // todo: ask if useRef makes sense in this context or if there is a better way
  // todo: (this needs to be accessible in handleClick callback and in useFrame and should not trigger a re-render)
  let rotating = useRef(true);

  // React Spring properties (Imperative API)
  const [springs, api] = useSpring(() => ({
    scale: 1,
    color: props.color,
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
  const handleClick = useCallback(() => {
    let expanded = false;

    return (event: ThreeEvent<MouseEvent>) => {
      event.nativeEvent.preventDefault();
      expanded = !expanded;
      rotating.current = !expanded;
      api.start({
        scale: expanded ? 1.3 : 1,
      });
    }
  }, []);
  const handlePointerOver = () => {
    // hovering
    console.log('pointer over')
    api.start({
      color: 'hotpink',
    });
  };
  const handlePointerOut = () => {
    console.log('pointer out')
    api.start({
      color: props.color,
    });
  };

  // Execute on frame render - CAREFUL: https://r3f.docs.pmnd.rs/api/hooks#useframe
  useFrame(() => {
    if (rotating.current) {
      meshRef.current.rotation.y = meshRef.current.rotation.y -= 0.02;
    }
  });

  function cloneThing(type: string) {
    if (!active) {
      setActive(true);
      props.setModules([...props.modules, new Module(props.type, meshRef.current.position)]);
    }
  }

  // JSX
  return (
    <>
    <DragControls
      onDragStart={() => {
        cloneThing(props.type);
      }}
    >
      <animated.mesh
        ref={meshRef}
        position={props.position}
        scale={springs.scale}
        // onClick={(event) => handleClick()}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onContextMenu={handleClick()}
      >
        <boxGeometry args={[1, 1, 1]} />
        <animated.meshStandardMaterial color={springs.color} />
        <Html><p style={{color: 'white'}}>Render ID – {Math.random()}</p></Html>
      </animated.mesh>
    </DragControls>
    </>
  );
}

export default Thing;
