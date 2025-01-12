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
  isPlaying: boolean;
  constructor() {
    // create synthesizer and connect to main output (speakers)
    this.synth = new Tone.Synth().toDestination();
    this.sequence = null;
    this.sequenceEvents = ['D4', 'A4', 'D5', 'F5', 'A5', 'F5', 'D5', 'A4'];
    this.sequenceSubdivision = '8n';
    this.isPlaying = false;
    this.createSequence();
  }

  /** create the tone sequence on this instrument from a list of note events, e.g. ['D4', 'C3'],
   * and a tempo (subdivision), e.g. '8n' for eigth notes. both arguments optional (set undefined to not change)
  */
  createSequence(events: string[] = this.sequenceEvents, subdivision: string = this.sequenceSubdivision) {
    console.log('setting sequence ' + events + ' with tempo (subdivision): ' + subdivision)
    this.sequence = new Tone.Sequence(
      (time, note) => {
        this.synth.triggerAttackRelease(note, '16n', time);
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
    console.log('setting sequence tempo to: ' + tempo)
    this.sequenceSubdivision = tempo;
    this.sequence?.stop(); // todo: start at same note? check global sync
    this.createSequence(undefined, this.sequenceSubdivision);
    this.sequence?.start();
  }
}

// See: https://tonejs.github.io/docs/15.0.4/classes/Context.html#latencyHint
// // prioritize sustained playback
// const context = new Tone.Context({ latencyHint: "playback" });
// // set this context as the global Context
// Tone.setContext(context);
// // the global context is gettable with Tone.getContext()
// console.log(Tone.getContext().latencyHint);
