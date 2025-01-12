/*  This component renders the module controls onto the 3d Shape
 */

import './Controls.css';
import { Html } from '@react-three/drei';
import { transport, Instrument } from '../instrument';

interface ControlsInstrumentProps {
  instrument: Instrument,
}

function ControlsInstrument(props: ControlsInstrumentProps) {

  const handleSelectTempo = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    props.instrument.setSequenceTempo(event.target.value);
  }
  const handleSelectNoteDuration = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    props.instrument.setNoteDuration(event.target.value);
  }
  const handleClickPlay = () => {
    props.instrument.playSequence();
  }
  const handleClickStop = () => {
    props.instrument.stopSequence();
  }

  return (
    <Html className='controlsHtml'>
      <div className='controls'>
        <label htmlFor='tempo'>tempo: </label>
        <select id='tempo' name='tempo' onChange={ (event) => {handleSelectTempo(event)} }>
          <option value="2n">2n</option>
          <option value="4n">4n</option>
          <option value="8n">8n</option>
          <option value="16n">16n</option>
          <option value="32n">32n</option>
          <option value="64n">64n</option>
        </select><br />
        <label htmlFor='note-duration'>note duration: </label>
        <select id='note-duration' name='note-duration' onChange={ (event) => {handleSelectNoteDuration(event)} }>
          <option value="2n">2n</option>
          <option value="4n">4n</option>
          <option value="8n">8n</option>
          <option value="16n">16n</option>
          <option value="32n">32n</option>
          <option value="64n">64n</option>
        </select><br />
        <button onClick={handleClickPlay}>play</button>
        <button onClick={handleClickStop}>stop</button>
      </div>
    </Html>
  );
}

export default ControlsInstrument;
