import { Html } from "@react-three/drei";
import { Vector3 } from "three";
import "./CubePositionDebugger.css";
interface debuggerProps {
  position: Vector3;
}
const CubePositionDebugger = ({ position }: debuggerProps) => {
  // const coordinates: Array<keyof Vector3> = ["x", "y", "z"];
  const coordinates = { x: position.x, y: position.y, z: position.z };
  return (
    <Html className="debug">
      {Object.entries(coordinates).map(([coordinate, value]) => (
        <p key={coordinate}>
          <strong>{coordinate.toUpperCase()}</strong>
          {Math.round(value * 10) / 10}
        </p>
      ))}
    </Html>
  );
};

export default CubePositionDebugger;
