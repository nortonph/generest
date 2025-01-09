import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import { useSpring, animated } from '@react-spring/three';
import { DragControls } from '@react-three/drei';

interface InstrumentProps {
  color: string;
  position: Vector3;
}

function Instrument(props: InstrumentProps) {
  // This reference will give us direct access to the mesh
  // from r3f docs - "using with typescript" about null!:
  // "The exclamation mark is a non-null assertion that will let TS know that ref.current is defined when we access it in effects."
  const meshRef = useRef<Mesh>(null!);

  // States
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [grabbed, setGrab] = useState(false);

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
  function handleClick() {
    setActive(!active);
    setRotating(!rotating);
    setExpanded(!expanded);
    api.start({
      scale: expanded ? 1.3 : 1,
    });
  }
  function handleHover(hovered: boolean) {
    setHover(hovered);
    api.start({
      color: hovered ? 'hotpink' : props.color,
    });
  }

  // Execute on frame render - CAREFUL: https://r3f.docs.pmnd.rs/api/hooks#useframe
  useFrame(() => {
    if (rotating) {
      meshRef.current.rotation.y = meshRef.current.rotation.y -= 0.02;
    }
    if (grabbed) {
    }
  });

  // JSX
  return (
    <DragControls>
      <animated.mesh
        ref={meshRef}
        position={props.position}
        scale={springs.scale}
        // onClick={(event) => handleClick()}
        onPointerOver={() => handleHover(true)}
        onPointerOut={() => handleHover(false)}
        onContextMenu={(event) => {
          // right click
          event.nativeEvent.preventDefault();
          handleClick();
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <animated.meshStandardMaterial color={springs.color} />
      </animated.mesh>
    </DragControls>
  );
}

export default Instrument;
