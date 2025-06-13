import { Mesh, Vector3 } from 'three';
import { Instrument } from '../instrument.tsx';
import { Datasource } from '../datasource.tsx';

// to track the state of modules, modules are wrapped in an object with numeric id
// (this can probably be refactored, it is a relatively late addition)
export interface ModuleObj {
  id: number;
  module: Module;
}

// A Module can be an instrument, an online data source (API) or another trigger,
// each represented by a 3d shape in the interface.
export class Module {
  // note: position here is the original position at creation and does not change (position in the "menu")
  // worldPos is the updated position in absolute world coordinates (original position + position
  // of DragControls, the parent of the shape mesh). See updatePosition() in Shape for how this is calculated
  type: string;
  color: string;
  position: Vector3;
  worldPos: Vector3;
  instrument: Instrument | undefined;
  datasource: Datasource | undefined;
  meshRef: React.MutableRefObject<Mesh> | undefined; // reference to the Shape mesh (e.g. cube)
  hasBeenDragged: boolean;
  constructor(
    type: string,
    position: Vector3,
    instrument: Instrument | undefined,
    datasource: Datasource | undefined
  ) {
    this.type = type;
    this.position = position;
    this.worldPos = position;
    this.instrument = instrument;
    this.datasource = datasource;
    this.meshRef = undefined;
    this.hasBeenDragged = false;
    switch (type) {
      case 'datasource':
        this.color = 'royalblue';
        break;
      case 'trigger':
        this.color = 'hotpink';
        break;
      case 'instrument':
        this.color = 'orange';
        break;
      default:
        this.color = 'white';
    }
  }
  clone(position: Vector3) {
    if (this.type === 'datasource') {
      return new Module(this.type, position, undefined, this.datasource);
    } else if (this.type === 'instrument') {
      return new Module(this.type, position, new Instrument(), undefined);
    } else {
      return new Module(this.type, position, undefined, undefined);
    }
  }
}
