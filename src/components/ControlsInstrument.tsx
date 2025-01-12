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
  const handleClickPlay = () => {
    console.log('play clicked')
    transport.start();
    props.instrument.playSequence();
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
        </select>
        <button onClick={handleClickPlay}>play</button>
      </div>
    </Html>
  );
}

export default ControlsInstrument;
