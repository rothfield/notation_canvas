import  {PitchAndNotationToPitchCodeMap} from "../models/pitch-mappings/pitch-and-notation-to-pitch-code.js";
import {PitchCodeAndNotationToPitchMap} from '../models/pitch-mappings/pitch-code-and-notation-to-pitch.js';
// notation-utils.js

export function pitchAndNotationToPitchCode(pitch,notation) {
  const key = `${pitch}:${notation}`;
return PitchAndNotationToPitchCodeMap[key];
}

export function pitchCodeAndNotationToPitch(pitchCode, notation) {
  const key = `${pitchCode}:${notation}`;
return PitchCodeAndNotationToPitchMap[key];
}
