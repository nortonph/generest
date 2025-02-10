// to track the state of connections in App.tsx, connections are wrapped in an object with numeric id
export interface ConnectionObj {
  id: number;
  connection: Connection;
}

// A connection is formed between two modules, from a datasource
// (in the future maybe also from a trigger) to an instrument
export class Connection {
  fromModuleId: number; // add Trigger here later
  toModuleId: number;
  constructor(fromModuleId: number, toModuleId: number) {
    this.fromModuleId = fromModuleId;
    this.toModuleId = toModuleId;
  }
}
