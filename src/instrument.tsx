import * as Tone from 'tone';
import { range, min, max } from 'lodash';

// IMPORTANT: Browsers will not play any audio until a user clicks something. (see docs)

/** Global timing (tempo, start, stop playback) handlded by a
 *   singleton class (can only be instantiated once)
 */
class Transport {
  private static _instance: Transport;

  private constructor() {
    Tone.getTransport().bpm.value = 90;
  }
  public static getInstance(): Transport {
    if (!Transport._instance) {
      this._instance = new this();
    }
    return this._instance;
  }

  start() {
    // start transport 100ms in the future to reduce audio failures
    Tone.getTransport().start('+0.1');
  }
  stop() {
    Tone.getTransport().stop();
  }
  toggle() {
    Tone.getTransport().toggle();
  }
}
export const transport = Transport.getInstance();

// musical scales
// to generate arbitrary scales, maybe look at Tone.Frequency().harmonize():
// https://tonejs.github.io/docs/15.0.4/classes/FrequencyClass.html#harmonize
const scales = {
  Dminor: ['D', 'E', 'F', 'G', 'A', 'B', 'C'],
  Dpenta: ['D', 'F', 'G', 'A', 'C'],
  Fmajor: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'],
};

/** Instrument to be used as a Module. generates sound from input using Tone.js */
export class Instrument {
  synth: Tone.Synth; // synthesizer
  scale: string[]; // musical scale (notes only)
  octave: number; // middle octave number
  rangeOct: number; // range of octaves
  notes: string[]; // list of playable notes (scale x octave)
  sequence: Tone.Sequence | null; // tone sequence
  sequenceEvents: string[]; // list of note+octave strings
  sequenceSubdivision: string; // durational interval btw. notes in sequence
  noteDuration: string; // how long note sounds
  distortion: Tone.Distortion;
  distortionLevel: number;
  reverb: Tone.Reverb;
  reverbDecay: number;
  isPlaying: boolean;
  constructor() {
    // create synthesizer and connect to main output (speakers)
    this.synth = new Tone.Synth().toDestination();
    this.scale = scales['Dminor'];
    (this.octave = 4), (this.rangeOct = 2), (this.sequence = null);
    this.notes = [];
    this.sequenceEvents = ['D4', 'A4', 'D5', 'F5', 'A5', 'F5', 'D5', 'A4'];
    this.sequenceSubdivision = '8n';
    this.noteDuration = '16n';
    this.distortionLevel = 0.4;
    this.distortion = new Tone.Distortion(this.distortionLevel).toDestination();
    this.reverbDecay = 0.3;
    this.reverb = new Tone.Reverb(this.reverbDecay);
    this.isPlaying = false;
    this.createSequence();
    this.createNotes();
  }

  /** create the available notes from the scale and the octaves +/- range */
  createNotes() {
    // todo: check for valid range & octave
    const octaves = range(
      this.octave - this.rangeOct,
      this.octave + this.rangeOct + 1
    );
    for (let oct of octaves) {
      this.notes = [...this.notes, ...this.scale.map((note) => note + oct)];
    }
    console.log('created available notes: ');
    console.log(this.notes);
  }

  /** generate note events from data points by mapping the range of data to the available notes */
  getNotesFromData(numberArray: number[]) {
    // todo: check for valid data and remove !s
    const minData = min(numberArray)!;
    const maxData = max(numberArray)!;
    const rangeData = maxData - minData;
    console.log('min, max range: ', minData, maxData, rangeData);
    // create array of evently spaced bins (n = available notes)
    const binsize = rangeData / this.notes.length;
    const binCenters: number[] = range(
      minData + binsize / 2,
      maxData - binsize / 2,
      binsize
    );
    // for each data point, find the closest bin and add the corresponding note
    let events: string[] = [];
    let minDist = rangeData;
    let iClosestBin = 0;
    for (let num of numberArray) {
      // this keeps track of minimum distance to bin centers. reset to maximum possible distance (range of data)
      minDist = rangeData;
      // find the index of the binCenter closest to num
      for (let i = 0; i < binCenters.length; i++) {
        if (Math.abs(binCenters[i] - num) < minDist) {
          minDist = Math.abs(binCenters[i] - num);
          iClosestBin = i;
        }
      }
      // add the corresponding note to events
      events.push(this.notes[iClosestBin]);
    }
    console.log('generated note events from data: ');
    console.log(events);
    return events;
  }

  /** create the tone sequence on this instrument from a list of note events, e.g. ['D4', 'C3'],
   * and a tempo (subdivision), e.g. '8n' for eigth notes. both arguments optional (set undefined to not change)
   */
  createSequence(
    events: string[] = this.sequenceEvents,
    subdivision: string = this.sequenceSubdivision
  ) {
    console.log('setting sequence with tempo ' + subdivision + ':');
    console.log(events);
    this.sequence = new Tone.Sequence(
      (time, note) => {
        this.synth.triggerAttackRelease(note, this.noteDuration, time);
      },
      events,
      subdivision
    );
  }

  playSequence() {
    if (this.sequence !== null) {
      console.log('starting sequence');
      this.sequence.start(); // 0 starts at beginning?
      this.isPlaying = true;
    } else {
      console.log('no sequence on Instrument, call createSequence() first');
    }
  }

  stopSequence() {
    if (this.sequence !== null) {
      console.log('stopping sequence');
      this.sequence.stop();
      this.isPlaying = false;
    } else {
      console.log('no sequence on Instrument, call createSequence() first');
    }
  }

  setSequenceTempo(tempo: string) {
    console.log('setting sequence tempo to: ' + tempo);
    this.sequenceSubdivision = tempo;
    this.sequence?.stop(); // todo: start at same note? check global sync
    this.createSequence(undefined, this.sequenceSubdivision);
    this.sequence?.start();
  }

  setNoteDuration(duration: string) {
    console.log('setting sequence tempo to: ' + duration);
    this.noteDuration = duration;
    this.sequence?.stop(); // todo: start at same note? check global sync
    this.createSequence(undefined, undefined);
    this.sequence?.start();
  }

  // effects ###############################################
  connectDistortion() {
    this.synth.connect(this.distortion);
  }

  disconnectDistortion() {
    this.synth.disconnect(this.distortion);
  }

  setDistortionLevel(level: number) {
    this.distortionLevel = level;
    this.distortion.set({ distortion: this.distortionLevel });
  }

  connectReverb() {
    this.synth.connect(this.reverb);
  }

  disconnectReverb() {
    this.synth.disconnect(this.reverb);
  }

  setReverbDecay(decay: number) {
    this.reverbDecay = decay;
    this.reverb.set({ decay: this.reverbDecay });
  }
}
