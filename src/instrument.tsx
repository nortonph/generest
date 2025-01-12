import * as Tone from 'tone';

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

/** Instrument to be used as a Module. generates sound from input using Tone.js */
export class Instrument {
  synth: Tone.Synth;
  sequence: Tone.Sequence | null;
  sequenceEvents: string[];
  sequenceSubdivision: string;
  noteDuration: string;
  distortion: Tone.Distortion;
  distortionLevel: number;
  reverb: Tone.Reverb;
  reverbDecay: number;
  isPlaying: boolean;
  constructor() {
    // create synthesizer and connect to main output (speakers)
    this.synth = new Tone.Synth().toDestination();
    this.sequence = null;
    this.sequenceEvents = ['D4', 'A4', 'D5', 'F5', 'A5', 'F5', 'D5', 'A4'];
    this.sequenceSubdivision = '8n';
    this.noteDuration = '16n';
    this.distortionLevel = 0.4;
    this.distortion = new Tone.Distortion(this.distortionLevel).toDestination();
    this.reverbDecay = 0.3;
    this.reverb = new Tone.Reverb(this.reverbDecay);
    this.isPlaying = false;
    this.createSequence();
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

// See: https://tonejs.github.io/docs/15.0.4/classes/Context.html#latencyHint
// // prioritize sustained playback
// const context = new Tone.Context({ latencyHint: "playback" });
// // set this context as the global Context
// Tone.setContext(context);
// // the global context is gettable with Tone.getContext()
// console.log(Tone.getContext().latencyHint);
