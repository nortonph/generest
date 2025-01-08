import { useRef, useState } from 'react';
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

  return (
    <mesh ref={meshRef} onClick={(event) => setActive(!active)}>
      <boxGeometry />
      <meshStandardMaterial color={active ? 'hotpink' : props.color} />
    </mesh>
  );
}

export default Instrument;
