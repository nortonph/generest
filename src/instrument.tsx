import * as Tone from 'tone';

export function createInstrument() {
  // create synthesizer and connect to main output (speakers)
  const synth = new Tone.Synth().toDestination();

  return synth;
}

export function playInstrument(instrument: Tone.Synth) {
  instrument.triggerAttackRelease('D4', '8n');
}
