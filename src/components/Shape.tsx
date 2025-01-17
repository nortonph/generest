/*  This React Three Fiber component renders a 3d Cube that represents
    a Module (Datasource / Instrument) in the interface.
*/

//TODO: Rename to Cube.tsx

import { useCallback, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Vector3 } from "three";
import { useSpring, animated } from "@react-spring/three";
import { DragControls, Html } from "@react-three/drei";
// import { Html } from "@react-three/drei";
import { Module, ModuleObj, Connection } from "@/App";
import ControlsInstrument from "@/components/ControlsInstrument";
import ControlsDatasource from "@/components/ControlsDatasource";
import { connectSourceToInstrument } from "@/helpers/shape-function";
import CubePositionDebugger from "@/components/CubePositionDebugger";

// A property object that is passed to the Shape component
interface ShapeProps {
  moduleObj: ModuleObj;
  addModule: (newModule: Module) => void;
  updateModule: (moduleObj: ModuleObj) => void;
  addConnection: (newConnection: Connection) => void;
  hotConnection: ModuleObj | undefined; // containing module that has been selected for connection (if any)
  setHotConnection: React.Dispatch<React.SetStateAction<ModuleObj | undefined>>;
  // key: number;
}

function Shape({
  moduleObj,
  addModule,
  updateModule,
  addConnection,
  hotConnection,
  setHotConnection,
}: // key,
ShapeProps) {
  // This reference will give us direct access to the mesh
  // from r3f docs - "using with typescript" about null!:
  // "The exclamation mark is a non-null assertion that will let TS know that ref.current is defined when we access it in effects."
  const meshRef = useRef<Mesh>(null!);
  moduleObj.module.meshRef = meshRef;

  // States and Refs ###############################################
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
    color: moduleObj.module.color,
    // set different durations based on what is being animated
    config: (key: any) => {
      switch (key) {
        case "scale":
          return { duration: 100 };
        case "color":
          return { duration: 200 };
        default:
          return {};
      }
    },
  }));

  // Mouse Interface ###############################################
  const handleLeftClick = () => {
    // Connect if it's an instrument and there is a hotConnection
    if (!expanded) {
      switch (moduleObj.module.type) {
        case "instrument":
          if (hotConnection) {
            createConnection();
          } else {
            console.log("Click a blue box first");
          }
          break;

        case "datasource":
          console.log("Clicked a datasource for connection");
          setHotConnection(moduleObj);
          break;
      }
    }
  };

  const handleRightClick = useCallback(() => {
    return () => {
      // Does nothing if one of the top 3 is clicked
      if (!active) return null;
      setControlsVisible(!expanded);
      expanded = !expanded;

      //Shows
      api.start({
        scale: expanded ? 7 : 1,
      });
    };
  }, [active]);

  const makeCubeWhite = () => {
    // Changes the hovered cube's color to white with a transition
    api.start({
      color: "white",
    });
  };

  const revertCubeColor = () => {
    api.start({
      color: moduleObj.module.color,
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

  // misc functions ###############################################
  function cloneShape() {
    // when dragging an inactive Shape ("menu item"), set it active and create a new inactive one in its place
    if (!active) {
      setActive(true);
      addModule(moduleObj.module.clone(moduleObj.module.position));
    }
  }

  function createConnection() {
    // create a new connection object and add it to the list
    const fromModule = hotConnection!;
    const toModule = moduleObj;
    const newConnection = new Connection(fromModule.id, toModule.id);

    //Create the cylinder going from blue to orange
    addConnection(newConnection);

    // Connect the data to the instrument
    connectSourceToInstrument({ toModule, fromModule });

    //Remove hot connection
    setHotConnection(undefined);
  }

  function updatePosition() {
    // update the absolute position of the shape in the scene (position of DragControls, which is the parent, plus initial position)
    moduleObj.module.worldPos = meshRef
      .current!.parent!.getWorldPosition(new Vector3())
      .add(moduleObj.module.position);
    updateModule(moduleObj);
  }

  // JSX ###############################################
  return (
    <>
      <DragControls
        onDragStart={() => {
          cloneShape();
        }}
        onDrag={() => {
          updatePosition();
        }}
        // Need to update this to make sure we create a new cube that doesn't collide with any other cube
        onDragEnd={() => {}}
      >
        <animated.mesh
          ref={meshRef}
          position={moduleObj.module.position}
          scale={springs.scale}
          onPointerOver={makeCubeWhite}
          onPointerOut={revertCubeColor}
          onClick={handleLeftClick}
          onContextMenu={handleRightClick()}
        >
          <boxGeometry args={[1, 1, 1]} />
          <animated.meshStandardMaterial color={springs.color} />
          {controlsVisible ? (
            moduleObj.module.type === "instrument" ? (
              <ControlsInstrument instrument={moduleObj.module.instrument!} />
            ) : moduleObj.module.type === "datasource" ? (
              <ControlsDatasource />
            ) : null
          ) : null}

          {/* uncomment the following to track whether this object re-renders due to state change (import Html from drei) */}
          {/* <CubePositionDebugger position={moduleObj.module.worldPos} /> */}
        </animated.mesh>
      </DragControls>
    </>
  );
}

export default Shape;
