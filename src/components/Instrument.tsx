import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface InstrumentProps {
  color: string;
}

function Instrument(props: InstrumentProps) {
  // This reference will give us direct access to the mesh
  // from r3f docs - "using with typescript" about null!:
  // "The exclamation mark is a non-null assertion that will let TS know that ref.current is defined when we access it in effects."
  const meshRef = useRef<Mesh>(null!);

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [rotating, setRotating] = useState(true);

  // Animations
  useFrame(() => {
    if (rotating) {
      meshRef.current.rotation.y = meshRef.current.rotation.y -= 0.02;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={(event) => {
        setActive(!active);
        setRotating(!rotating);
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={active ? 'hotpink' : props.color} />
    </mesh>
  );
}

export default Instrument;
