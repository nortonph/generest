import * as Tone from 'tone';

// IMPORTANT: Browsers will not play any audio until a user clicks something. (see docs)

// Global timing (tempo, start, stop playback) handlded by a
// singleton class (can only be instantiated once)
class Transport {
  private static _instance: Transport;

  private constructor() {
    Tone.getTransport().bpm.value = 90;
  }
  public static getInstance(): Transport {
    if (!Transport._instance) {
      this._instance = new this;
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
  constructor() {
    // create synthesizer and connect to main output (speakers)
    this.synth = new Tone.Synth().toDestination();
    this.sequence = null;
    this.createSequence();
  }

  createSequence() {
    this.sequence = new Tone.Sequence((time, note) => {
      this.synth.triggerAttackRelease(note, '8n', time);
    }, ['D4', 'A4', 'D5', 'F5', 'A5', 'F5', 'D5', 'A4'])
  }

  playSequence() {
    if (this.sequence !== null) {
      console.log('starting sequence');
      this.sequence.start(); // 0 starts at beginning?
    } else {
      console.log('no sequence on Instrument, call createSequence() first');
    }
  }
  stopSequence() {
    if (this.sequence !== null) {
      console.log('stopping sequence');
      this.sequence.stop();
    } else {
      console.log('no sequence on Instrument, call createSequence() first');
    }
  }
}
