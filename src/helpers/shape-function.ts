import { ModuleObj} from "../App";

interface connectSourceToInstrumentProps {
    fromModule: ModuleObj;
    toModule: ModuleObj;
}
export const connectSourceToInstrument = ({fromModule, toModule}: connectSourceToInstrumentProps) => {
    const noteEvents = toModule.module.instrument?.getNotesFromData(
        fromModule.module.datasource?.numberArray!
      );
      toModule.module.instrument?.setSequenceEvents(noteEvents!);
      toModule.module.instrument?.createSequence();
      toModule.module.instrument?.playSequence();
} 
