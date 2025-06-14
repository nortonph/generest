/*  This component renders the module controls onto the 3d Shape
 */

import './Controls.css';
import { useState } from 'react';
import { Html } from '@react-three/drei';
import { Instrument, scales } from '../instrument';

interface ControlsInstrumentProps {
  instrument: Instrument;
}

function ControlsInstrument(props: ControlsInstrumentProps) {
  const [tempo, setTempo] = useState('8n');
  const [noteDur, setNoteDur] = useState('16n');
  const [octave, setOctave] = useState(4);
  const [octRange, setOctRange] = useState(2);

  const handleSelectScale = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log(event.target.value);
    props.instrument.setScale(event.target.value as (keyof typeof scales));
  };
  const handleSelectTempo = (tempo: string) => {
    console.log(tempo);
    setTempo(tempo);
    props.instrument.setSequenceTempo(tempo);
  };
  const handleSelectNoteDuration = (noteDur: string) => {
    console.log(noteDur);
    setNoteDur(noteDur);
    props.instrument.setNoteDuration(noteDur);
  };
  // const handleSelectSequenceLength = (
  //   event: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   console.log(event.target.value);
  //   props.instrument.setNNotesInSequence(Number(event.target.value));
  // };
  const handleSelectOctave = (octave: number) => {
    console.log(octave);
    setOctave(octave);
    props.instrument.setOctave(octave);
  };
  const handleSelectOctaveRange = (octRange: number) => {
    console.log(octRange);
    setOctRange(octRange)
    props.instrument.setOctaveRange(octRange);
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

  // todo: programmatically set default option in select tags? (i.e. get from value instrument)
  // todo: => maybe <select value or defaultValue> instead of <option selected>

  return (
    <Html className='controlsHtml'>
      <div className='controls'>
        <div className='control'>
          <label htmlFor='scale'>scale: </label>
          <select
            id='scale'
            name='scale'
            onChange={(event) => {
              handleSelectScale(event);
            }}
          >
            <option value='Dminor' selected>
              Dminor
            </option>
            <option value='Dpenta'>Dpenta</option>
            <option value='Fmajor'>Fmajor</option>
          </select>
        </div>
        <div className='control'>
          <label htmlFor='tempo'>tempo: </label>
          <input type='range' name='tempo' id='tempo' min='1' max='6' 
            value={Math.log(parseInt(tempo)) / Math.log(2)}
            onChange={(event) => {handleSelectTempo(Math.pow(2, parseInt(event.target.value)) + 'n');}}/>
          <span>{tempo}</span>      
        </div>
        <div className='control'>
          <label htmlFor='note-duration'>note dur.: </label>
          <input type='range' name='note-duration' id='note-duration' min='1' max='6' 
            value={Math.log(parseInt(noteDur)) / Math.log(2)}
            onChange={(event) => {handleSelectNoteDuration(Math.pow(2, parseInt(event.target.value)) + 'n');}}/>
          <span>{noteDur}</span>      
        </div>
        {/* <label htmlFor='sequence-length'>sequence-length: </label>
        <select
          id='sequence-length'
          name='sequence-length'
          onChange={(event) => {
            handleSelectSequenceLength(event);
          }}
        >
          <option value='4'>4</option>
          <option value='8'>8</option>
          <option value='16' selected>16</option>
          <option value='32'>32</option>
          <option value='64'>64</option>
        </select>
        <br /> */}
        <div className='control'>
          <label htmlFor='octave'>octave: </label>
          <input type='range' name='octave' id='octave' min='2' max='7' 
            value={octave}
            onChange={(event) => {handleSelectOctave(parseInt(event.target.value));}}/>
          <span>{octave}</span>      
        </div>
        <div className='control'>
          <label htmlFor='octave-range'>oct. range: </label>
          <input type='range' name='octave-range' id='octave-range' min='0' max='4' 
            value={octRange}
            onChange={(event) => {handleSelectOctaveRange(parseInt(event.target.value));}}/>
          <span>{octRange}</span>      
        </div>
        <div className='control'>
          <label htmlFor='distortion'>distortion:</label>
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
          <input
            type='checkbox'
            id='distortion'
            name='distortion'
            onChange={(event) => {
              handleCheckboxDistortion(event);
            }}
          />
        </div>
        {/* <label htmlFor='reverb'>reverb:</label>
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
        /> */}
        <br />
        <div className='controlButtons'>
          <button onClick={handleClickPlay}>play</button>
          <button onClick={handleClickStop}>stop</button>
        </div>
      </div>
    </Html>
  );
}

export default ControlsInstrument;
