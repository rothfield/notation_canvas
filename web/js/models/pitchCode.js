import { Notation, CANONICAL_NOTATION } from "./notation.js";

export function computePitchCode(pitch, notation) {
  switch (notation) {
    case Notation.SARGAM:
      return sargamMap[pitch] ?? "";
    case Notation.NUMBER:
      return pitch;
    case Notation.WESTERN:
      return westernMap[pitch.toLowerCase()] ?? "";
    default:
      return "";
  }
}

export const sargamMap = {
  "S": "1",
  "S#": "1#",
  "Sb": "1b",
  "S##": "1##",
  "Sbb": "1bb",
  "R": "2",
  "R#": "2#",
  "r": "2b",
  "R##": "2##",
  "Rbb": "2bb",
  "G": "3",
  "G#": "3#",
  "g": "3b",
  "G##": "3##",
  "Gbb": "3bb",
  "m": "4",
  "M": "4#",
  "mb": "4b",
  "M#": "4##",
  "mbb": "4bb",
  "P": "5",
  "P#": "5#",
  "Pb": "5b",
  "P##": "5##",
  "Pbb": "5bb",
  "D": "6",
  "D#": "6#",
  "d": "6b",
  "D##": "6##",
  "Dbb": "6bb",
  "N": "7",
  "N#": "7#",
  "n": "7b",
  "N##": "7##",
  "Nbb": "7bb"
};

export const westernMap = {
  "c": "1",
  "csh": "1#",
  "cb": "1b",
  "cshsh": "1##",
  "cbb": "1bb",
  "d": "2",
  "dsh": "2#",
  "db": "2b",
  "dshsh": "2##",
  "dbb": "2bb",
  "e": "3",
  "esh": "3#",
  "eb": "3b",
  "eshsh": "3##",
  "ebb": "3bb",
  "f": "4",
  "fsh": "4#",
  "fb": "4b",
  "fshsh": "4##",
  "fbb": "4bb",
  "g": "5",
  "gsh": "5#",
  "gb": "5b",
  "gshsh": "5##",
  "gbb": "5bb",
  "a": "6",
  "ash": "6#",
  "ab": "6b",
  "ashsh": "6##",
  "abb": "6bb",
  "b": "7",
  "bsh": "7#",
  "bb": "7b",
  "bshsh": "7##",
  "bbb": "7bb"
};
