/*  This component renders the module controls onto the 3d Shape
 */

import './Controls.css';
import { Html } from '@react-three/drei';
import { Instrument } from '../instrument';

interface ControlsInstrumentProps {
  instrument: Instrument;
}

function ControlsInstrument(props: ControlsInstrumentProps) {
  const handleSelectTempo = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    props.instrument.setSequenceTempo(event.target.value);
  };
  const handleSelectNoteDuration = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log(event.target.value);
    props.instrument.setNoteDuration(event.target.value);
  };
  const handleCheckboxDistortion = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.checked);
    event.target.checked
      ? props.instrument.connectDistortion()
      : props.instrument.disconnectDistortion();
  };
  const handleSliderDistortionLevel = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.value);
    props.instrument.setDistortionLevel(Number(event.target.value) / 100);
  };
  const handleCheckboxReverb = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked);
    event.target.checked
      ? props.instrument.connectReverb()
      : props.instrument.disconnectReverb();
  };
  const handleSliderReverbDecay = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.value);
    props.instrument.setReverbDecay(Number(event.target.value) / 100);
  };
  const handleClickPlay = () => {
    props.instrument.playSequence();
  };
  const handleClickStop = () => {
    props.instrument.stopSequence();
  };

  return (
    <Html className='controlsHtml'>
      <div className='controls'>
        <label htmlFor='tempo'>tempo: </label>
        <select
          id='tempo'
          name='tempo'
          onChange={(event) => {
            handleSelectTempo(event);
          }}
        >
          <option value='2n'>2n</option>
          <option value='4n'>4n</option>
          <option value='8n'>8n</option>
          <option value='16n'>16n</option>
          <option value='32n'>32n</option>
          <option value='64n'>64n</option>
        </select>
        <br />
        <label htmlFor='note-duration'>note duration: </label>
        <select
          id='note-duration'
          name='note-duration'
          onChange={(event) => {
            handleSelectNoteDuration(event);
          }}
        >
          <option value='2n'>2n</option>
          <option value='4n'>4n</option>
          <option value='8n'>8n</option>
          <option value='16n'>16n</option>
          <option value='32n'>32n</option>
          <option value='64n'>64n</option>
        </select>
        <br />
        <label htmlFor='distortion'>distortion:</label>
        <input
          type='checkbox'
          id='distortion'
          name='distortion'
          onChange={(event) => {
            handleCheckboxDistortion(event);
          }}
        />
        <input
          type='range'
          id='distLevel'
          name='distLevel'
          min='0'
          max='400'
          onChange={(event) => {
            handleSliderDistortionLevel(event);
          }}
        />
        <label htmlFor='reverb'>reverb:</label>
        <input
          type='checkbox'
          id='reverb'
          name='reverb'
          onChange={(event) => {
            handleCheckboxReverb(event);
          }}
        />
        <input
          type='range'
          id='reverbDecay'
          name='reverbDecay'
          min='20'
          max='200'
          onChange={(event) => {
            handleSliderReverbDecay(event);
          }}
        />
        <button onClick={handleClickPlay}>play</button>
        <button onClick={handleClickStop}>stop</button>
      </div>
    </Html>
  );
}

export default ControlsInstrument;
