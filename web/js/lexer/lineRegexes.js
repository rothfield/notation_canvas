// Define multi-character barline variants (escaped automatically)
const barlineVariants = [":||", "|:|", "|:", ":|", "||", "|"];
const barlinePattern = `(${barlineVariants.map(s => s.replace(/([|:])/g, '\\$1')).join('|')})`;

// Shared pattern parts after pitch
const commonPatterns = [
  barlinePattern,      // [2] Barline
  '(\\-)',             // [3] Dash
  '(\\()',             // [4] Left slur
  '(\\))',             // [5] Right slur
  '([ \\t]+)',         // [6] Whitespace
  '(.)'                // [7] Unknown
];

// Shared pitch pattern definitions
const pitchPatterns = {
  western: '[a-gA-G](?:b{1,2}|#{1,2})?',
  number:  '1#?|2b?|2#?|3b?|3|4#?|5b?|5#?|6b?|6|7b?|7',
  sargam:  'S#?|s#?|R#?|R|r|g|G|m|M|P#?|Pb|pb|p#?|p|d|D|n|N',
  solfege: '(D|r|R|m|M|f|F|S|l|L|t|T)(?:b{1,2}|#{1,2})?'
};

// Builds a regex for validating a single complete token
function makeSingleTokenRegex(pitchPattern) {
  return new RegExp(
    ['^(' + pitchPattern + ')', ...commonPatterns].join('|') + '$'
  );
}

// Builds a global regex for tokenizing an entire line
function makeLineTokenizerRegex(pitchPattern) {
  return new RegExp(
    ['(' + pitchPattern + ')', ...commonPatterns].join('|'),
    'g'
  );
}

export const singleTokenRegexes = Object.fromEntries(
  Object.entries(pitchPatterns).map(([kind, pattern]) => [kind, makeSingleTokenRegex(pattern)])
);

export const lineTokenizerRegexes = Object.fromEntries(
  Object.entries(pitchPatterns).map(([kind, pattern]) => [kind, makeLineTokenizerRegex(pattern)])
);

