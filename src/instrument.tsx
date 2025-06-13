import * as Tone from 'tone';
import { range, min, max, mean } from 'lodash';

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
export const scales = {
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
  dataArray: number[]; // copy of numberArray from datasource
  sequence: Tone.Sequence | null; // tone sequence
  sequenceEvents: string[]; // list of note+octave strings
  sequenceSubdivision: string; // durational interval btw. notes in sequence
  nNotesInSequence: number; // todo: calculate automatically from sequenceSubdivision, i.e. tempo
  noteDuration: string; // how long note sounds
  distortion: Tone.Distortion;
  distortionLevel: number;
  reverb: Tone.Reverb;
  reverbDecay: number;
  isPlaying: boolean;
  constructor() {
    // create synthesizer and connect to main output (speakers)
    this.synth = new Tone.Synth().toDestination();
    this.synth.volume.value = -8;
    console.log('VOL: ', this.synth.volume.value)
    this.scale = scales['Dminor'];
    (this.octave = 4), (this.rangeOct = 2), (this.sequence = null);
    this.notes = [];
    this.dataArray = [];
    this.sequenceEvents = [];
    this.sequenceSubdivision = '8n';
    this.nNotesInSequence = 32;
    this.noteDuration = '16n';
    this.distortionLevel = 0.4;
    this.distortion = new Tone.Distortion(this.distortionLevel).toDestination();
    this.reverbDecay = 0.3;
    this.reverb = new Tone.Reverb(this.reverbDecay);
    this.isPlaying = false;
    this.createSequence();
    this.createNotes();  // todo: remove?
  }

  /** create the available notes from the scale and the octaves +/- range */
  createNotes() {
    // todo: check for valid range & octave
    const octaves = range(
      this.octave - this.rangeOct,
      this.octave + this.rangeOct + 1
    );
    console.log('creating notes from octave ', this.octave, ' & range ', this.rangeOct, ': ', octaves)
    this.notes = [];
    for (let oct of octaves) {
      this.notes = [...this.notes, ...this.scale.map((note) => note + oct)];
    }
    console.log('...created available notes: ');
    console.log(this.notes);
  }

  /** generate note events from data points by mapping the range of data to the available notes */
  getNotesFromData(numberArray?: number[]) {
    if (numberArray) {
      this.dataArray = numberArray;
    }
    const data = this.dataArray;
    // todo: check for valid data and remove !s
    const nNumbers = data.length;
    const minData = min(data)!;
    const maxData = max(data)!;
    const rangeData = maxData - minData;
    console.log('min, max range: ', minData, maxData, rangeData);
    // create array of evently spaced bins (n = available notes)
    const binsize = rangeData / this.notes.length;
    const binCenters: number[] = range(
      minData + binsize / 2,
      maxData - binsize / 2,
      binsize
    );
    // for each sequence step, average data points around that step, find the closest bin and add the corresponding note
    let events: string[] = [];
    let minDist = rangeData;
    let iClosestBin = 0;
    // loop over number of notes in sequence
    for (let iNote = 0; iNote < this.nNotesInSequence; iNote++) {
      // get the indices of data points to average
      const firstNumIdx = Math.round((iNote / this.nNotesInSequence) * (nNumbers - 1)); // note: -1 might not be needed
      const lastNumIdx = Math.round(((iNote + 1) / this.nNotesInSequence) * (nNumbers - 1));
      const numAverageForNote = mean(data.slice(firstNumIdx, lastNumIdx));
      // this keeps track of minimum distance to bin centers. reset to maximum possible distance (range of data)
      minDist = rangeData;
      // find the index of the binCenter closest to num
      for (let iBin = 0; iBin < binCenters.length; iBin++) {
        if (Math.abs(binCenters[iBin] - numAverageForNote) < minDist) {
          minDist = Math.abs(binCenters[iBin] - numAverageForNote);
          iClosestBin = iBin;
        }
      }
      // add the corresponding note to events
      events.push(this.notes[iClosestBin]);
    }
    this.setSequenceEvents(events);
    console.log('generated note events from data: ');
    console.log(events);
  }

  /** create the tone sequence on this instrument from a list of note events, e.g. ['D4', 'C3'],
   * and a tempo (subdivision), e.g. '8n' for eigth notes. both arguments optional (set undefined to not change)
   */
  createSequence(events?: string[], subdivision?: string) {
    const tmpEvents = events ? events : this.sequenceEvents;
    const tmpSubdivision = subdivision ? subdivision : this.sequenceSubdivision;
    console.log('setting sequence with tempo ' + tmpSubdivision + ':');
    console.log(tmpEvents);
    this.sequence = new Tone.Sequence(
      (time, note) => {
        this.synth.triggerAttackRelease(note, this.noteDuration, time);
      },
      tmpEvents,
      tmpSubdivision
    );
  }

  setSequenceEvents(events: string[]) {
    // todo: check data validity
    this.sequenceEvents = events;
  }

  clearSequence() {
    this.notes = [];
    this.sequence = null;
    this.dataArray = [];
    this.sequenceEvents = [];
    this.createSequence();  // todo: remove?
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

  // parameter setters for instrument controls #################################
  // todo: check input validity for all these
  setScale(scaleName: keyof typeof scales) {
    this.scale = scales[scaleName];
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

  setOctave(octave: number) {
    this.octave = octave;
    this.createNotes();
    this.getNotesFromData();
    this.sequence?.stop(); // todo: start at same note? check global sync
    this.createSequence(undefined, undefined);
    this.sequence?.start();
  }

  setOctaveRange(rangeOct: number) {
    this.rangeOct = rangeOct;
    this.createNotes();
    this.getNotesFromData();
    this.sequence?.stop(); // todo: start at same note? check global sync
    this.createSequence(undefined, undefined);
    this.sequence?.start();
  }

  setNNotesInSequence(nNotesInSequence: number) {
    this.nNotesInSequence = nNotesInSequence;
    this.getNotesFromData();
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
