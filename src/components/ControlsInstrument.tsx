/*  This component renders the module controls onto the 3d Shape
 */

import "./Controls.css";
import { Html } from "@react-three/drei";
import { Instrument, scales } from "../instrument";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Button } from "./ui/button";

interface ControlsInstrumentProps {
  instrument: Instrument;
}

function ControlsInstrument({ instrument }: ControlsInstrumentProps) {
  const handleSelectTempo = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    instrument.setSequenceTempo(event.target.value);
  };
  const handleSelectScale = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    instrument.setScale(event.target.value as keyof typeof scales);
  };
  const handleSelectNoteDuration = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log(event.target.value);
    instrument.setNoteDuration(event.target.value);
  };
  const handleSelectSequenceLength = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log(event.target.value);
    instrument.setNNotesInSequence(Number(event.target.value));
  };
  const handleSelectOctave = (event: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(event.target.value);
    instrument.setOctave(Number(event.target.value));
  };
  const handleSelectOctaveRange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    console.log(event.target.value);
    instrument.setOctaveRange(Number(event.target.value));
  };
  const handleCheckboxDistortion = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.checked);
    event.target.checked
      ? instrument.connectDistortion()
      : instrument.disconnectDistortion();
  };
  const handleSliderDistortionLevel = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.value);
    instrument.setDistortionLevel(Number(event.target.value) / 100);
  };
  const handleCheckboxReverb = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked);
    event.target.checked
      ? instrument.connectReverb()
      : instrument.disconnectReverb();
  };
  const handleSliderReverbDecay = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.value);
    instrument.setReverbDecay(Number(event.target.value) / 100);
  };
  const handleClickPlay = () => {
    instrument.playSequence();
  };
  const handleClickStop = () => {
    instrument.stopSequence();
  };

  // todo: programmatically set default option in select tags? (i.e. get from value instrument)
  // todo: => maybe <select value or defaultValue> instead of <option selected>

  const [isOpen, setIsOpen] = useState(true);
  return (
    <Html className="controlsHtml">
      <div className="controls">
        <label htmlFor="scale">scale: </label>
        <select
          id="scale"
          name="scale"
          onChange={(event) => {
            handleSelectScale(event);
          }}
        >
          <option value="Dminor" selected>
            Dminor
          </option>
          <option value="Dpenta">Dpenta</option>
          <option value="Fmajor">Fmajor</option>
        </select>
        <br />
        <label htmlFor="tempo">tempo: </label>
        <select
          id="tempo"
          name="tempo"
          onChange={(event) => {
            handleSelectTempo(event);
          }}
        >
          <option value="2n">2n</option>
          <option value="4n">4n</option>
          <option value="8n" selected>
            8n
          </option>
          <option value="16n">16n</option>
          <option value="32n">32n</option>
          <option value="64n">64n</option>
        </select>
        <br />
        <label htmlFor="note-duration">note duration: </label>
        <select
          id="note-duration"
          name="note-duration"
          onChange={(event) => {
            handleSelectNoteDuration(event);
          }}
        >
          <option value="2n">2n</option>
          <option value="4n">4n</option>
          <option value="8n">8n</option>
          <option value="16n" selected>
            16n
          </option>
          <option value="32n">32n</option>
          <option value="64n">64n</option>
        </select>
        <br />
        <label htmlFor="sequence-length">sequence-length: </label>
        <select
          id="sequence-length"
          name="sequence-length"
          onChange={(event) => {
            handleSelectSequenceLength(event);
          }}
        >
          <option value="4">4</option>
          <option value="8">8</option>
          <option value="16" selected>
            16
          </option>
          <option value="32">32</option>
          <option value="64">64</option>
        </select>
        <br />
        <label htmlFor="octave">octave: </label>
        <select
          id="octave"
          name="octave"
          onChange={(event) => {
            handleSelectOctave(event);
          }}
        >
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4" selected>
            4
          </option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </select>
        <br />
        <label htmlFor="octave-range">octave-range: </label>
        <select
          id="octave-range"
          name="octave-range"
          onChange={(event) => {
            handleSelectOctaveRange(event);
          }}
        >
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2" selected>
            2
          </option>
          <option value="3">3</option>
          <option value="4">4</option>
        </select>
        <br />
        <label htmlFor="distortion">distortion:</label>
        <input
          type="checkbox"
          id="distortion"
          name="distortion"
          onChange={(event) => {
            handleCheckboxDistortion(event);
          }}
        />
        <input
          type="range"
          id="distLevel"
          name="distLevel"
          min="0"
          max="400"
          onChange={(event) => {
            handleSliderDistortionLevel(event);
          }}
        />
        <label htmlFor="reverb">reverb:</label>
        <input
          type="checkbox"
          id="reverb"
          name="reverb"
          onChange={(event) => {
            handleCheckboxReverb(event);
          }}
        />
        <input
          type="range"
          id="reverbDecay"
          name="reverbDecay"
          min="20"
          max="200"
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
