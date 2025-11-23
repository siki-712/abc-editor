import type { AbcFieldKey } from '../types/abc';

export interface Suggestion {
  value: string;
  description?: string;
  template?: string; // コマンド用のテンプレート（/headerなど）
}

// ABC記法の各フィールドに対する候補データ
export const ABC_SUGGESTIONS: Record<AbcFieldKey, Suggestion[]> = {
  'X:': [
    { value: '1', description: 'Reference number 1' },
    { value: '2', description: 'Reference number 2' },
  ],
  'T:': [
    { value: 'タイトル', description: 'Japanese title template' },
    { value: 'Untitled', description: 'Default title' },
  ],
  'M:': [
    { value: '4/4', description: 'Common time' },
    { value: '3/4', description: 'Waltz time' },
    { value: '2/4', description: 'March time' },
    { value: '6/8', description: 'Compound duple' },
    { value: '9/8', description: 'Compound triple' },
    { value: '12/8', description: 'Compound quadruple' },
    { value: '5/4', description: 'Quintuple meter' },
    { value: '7/8', description: 'Septuple meter' },
    { value: 'C', description: 'Common time (4/4)' },
    { value: 'C|', description: 'Cut time (2/2)' },
  ],
  'L:': [
    { value: '1/4', description: 'Quarter note' },
    { value: '1/8', description: 'Eighth note' },
    { value: '1/16', description: 'Sixteenth note' },
  ],
  'Q:': [
    { value: '1/4=120', description: 'Quarter note = 120 BPM' },
    { value: '1/4=100', description: 'Quarter note = 100 BPM' },
    { value: '1/4=80', description: 'Quarter note = 80 BPM' },
    { value: '1/8=180', description: 'Eighth note = 180 BPM' },
  ],
  'K:': [
    { value: 'C' },
    { value: 'G' },
    { value: 'D' },
    { value: 'A' },
    { value: 'E' },
    { value: 'B' },
    { value: 'F#' },
    { value: 'C#' },
    { value: 'F' },
    { value: 'Bb' },
    { value: 'Eb' },
    { value: 'Ab' },
    { value: 'Db' },
    { value: 'Gb' },
    { value: 'Cb' },
    { value: 'Am' },
    { value: 'Em' },
    { value: 'Bm' },
    { value: 'F#m' },
    { value: 'C#m' },
    { value: 'G#m' },
    { value: 'D#m' },
    { value: 'Dm' },
    { value: 'Gm' },
    { value: 'Cm' },
    { value: 'Fm' },
    { value: 'Bbm' },
    { value: 'Ebm' },
    { value: 'Abm' },
  ],
  'C:': [
    { value: 'Traditional', description: 'Traditional composer' },
    { value: 'Unknown', description: 'Unknown composer' },
  ],
  'R:': [
    { value: 'reel', description: 'Reel rhythm' },
    { value: 'jig', description: 'Jig rhythm' },
    { value: 'hornpipe', description: 'Hornpipe rhythm' },
    { value: 'waltz', description: 'Waltz rhythm' },
    { value: 'march', description: 'March rhythm' },
  ],
  'A:': [
    { value: 'Ireland', description: 'Area: Ireland' },
    { value: 'Scotland', description: 'Area: Scotland' },
    { value: 'England', description: 'Area: England' },
    { value: 'USA', description: 'Area: USA' },
    { value: 'Japan', description: 'Area: Japan' },
  ],
  'B:': [
    { value: 'The Session', description: 'Book: The Session' },
    { value: "O'Neill's Music of Ireland", description: "Book: O'Neill's Music of Ireland" },
  ],
  'D:': [
    { value: 'Album Name (Year)', description: 'Discography template' },
  ],
  'F:': [
    { value: 'https://thesession.org/', description: 'File URL template' },
  ],
  'G:': [
    { value: 'Group name', description: 'Group template' },
  ],
  'H:': [
    { value: 'History note', description: 'History template' },
  ],
  'I:': [
    { value: 'abc-charset utf-8', description: 'Character set: UTF-8' },
  ],
  'm:': [
    { value: '~g2 = {a}g{f}g', description: 'Macro definition template' },
  ],
  'N:': [
    { value: 'Note text', description: 'Notes template' },
  ],
  'O:': [
    { value: 'Traditional', description: 'Origin: Traditional' },
    { value: 'Ireland', description: 'Origin: Ireland' },
    { value: 'Scotland', description: 'Origin: Scotland' },
  ],
  'P:': [
    { value: 'AABB', description: 'Parts: AABB' },
    { value: 'ABCD', description: 'Parts: ABCD' },
    { value: 'A', description: 'Part: A' },
    { value: 'B', description: 'Part: B' },
  ],
  'r:': [
    { value: 'Remark text', description: 'Remark template' },
  ],
  'S:': [
    { value: 'Session tune', description: 'Source: Session' },
    { value: 'Traditional', description: 'Source: Traditional' },
  ],
  's:': [
    { value: 'Symbol line', description: 'Symbol line template' },
  ],
  'U:': [
    { value: 'u = !trill!', description: 'User defined: trill' },
  ],
  'V:': [
    { value: '1', description: 'Voice 1' },
    { value: '2', description: 'Voice 2' },
    { value: 'T', description: 'Tenor voice' },
    { value: 'B', description: 'Bass voice' },
  ],
  'W:': [
    { value: 'Lyrics line', description: 'Words (multi-line)' },
  ],
  'w:': [
    { value: 'Lyrics for this line', description: 'Words (aligned)' },
  ],
  'Z:': [
    { value: 'Your Name', description: 'Transcriber name' },
    { value: 'ABC transcription', description: 'Transcription note' },
  ],
};

// フィールドキーから候補を取得する関数
export const getSuggestionsForField = (fieldKey: AbcFieldKey): Suggestion[] => {
  return ABC_SUGGESTIONS[fieldKey] || [];
};
