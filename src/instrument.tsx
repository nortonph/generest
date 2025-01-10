import * as Tone from 'tone';

// IMPORTANT: Browsers will not play any audio until a user clicks something. (see docs)

// See: https://tonejs.github.io/docs/15.0.4/classes/Context.html#latencyHint
// // prioritize sustained playback
// const context = new Tone.Context({ latencyHint: "playback" });
// // set this context as the global Context
// Tone.setContext(context);
// // the global context is gettable with Tone.getContext()
// console.log(Tone.getContext().latencyHint);

// Global timing (tempo, start, stop playback) handlded by a
// singleton class (can only be instantiated once)
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

export class Instrument {
  synth: Tone.Synth;
  sequence: Tone.Sequence | null;
  isPlaying: boolean;
  constructor() {
    // create synthesizer and connect to main output (speakers)
    this.synth = new Tone.Synth().toDestination();
    this.sequence = null;
    this.isPlaying = false;
    this.createSequence();
  }

  createSequence() {
    this.sequence = new Tone.Sequence(
      (time, note) => {
        this.synth.triggerAttackRelease(note, '16n', time);
      },
      ['D4', 'A4', 'D5', 'F5', 'A5', 'F5', 'D5', 'A4'],
      '16n'
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
}
