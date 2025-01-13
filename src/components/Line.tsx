import { Vector3 } from 'three';
import { Connection } from '../App';

interface LineProps {
  connection: Connection;
  key: number; // for react component; could change during object lifetime
}

function Line(props: LineProps) {
  // JSX
  return (
    <mesh
      position={props.connection.from.meshRef?.current.parent?.getWorldPosition(
        new Vector3()
      )}
    >
      <cylinderGeometry args={[0.1, 0.1, 20, 32]} />
      <meshStandardMaterial />
    </mesh>
  );
}

export default Line;
