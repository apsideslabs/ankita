/** Core types for the Aṅkita engine. Everything here is deterministic and pure. */

export type Gender = 'male' | 'female' | 'unspecified';

export type Layer = 'chaldean' | 'graha' | 'loshu' | 'sanskrit' | 'kua';

export interface ProvenanceRef {
  /** Short id used in the UI chip. */
  id: string;
  label: string;
  /** Where the rule comes from, stated plainly. */
  source: string;
  /** Year of the source, for sorting and display. */
  year: number | null;
  /** How confident the attribution is. */
  status: 'verified' | 'attributed' | 'unverified';
}

export interface BirthInput {
  /** Full name as the family uses it. */
  name: string;
  /** ISO date, yyyy-mm-dd. */
  date: string;
  gender: Gender;
  /** Keep 11 / 22 / 33 as master numbers instead of reducing to 1–9. */
  masterNumbers: boolean;
}

export interface NumberFact {
  value: number;
  /** The unreduced sum that produced it, where one exists. */
  compound: number | null;
  /** One-line gloss. */
  meaning: string;
  layer: Layer;
}

export interface NameBreakdown {
  letter: string;
  value: number;
}

export interface GridCell {
  digit: number;
  count: number;
  plane: 'mental' | 'emotional' | 'practical';
}

export interface GridLine {
  id: string;
  cells: number[];
  label: string;
  kind: 'row' | 'column' | 'diagonal';
  complete: boolean;
  /** The layer this line-name belongs to. Lo Shu line names are modern. */
  layer: Layer;
}

export interface TimingPoint {
  label: string;
  value: number;
  detail: string;
}

import type { NumberReading } from './interpretation';

export interface TraceStep {
  id: string;
  section: 'input' | 'core' | 'name' | 'grid' | 'kua' | 'timing' | 'sanskrit';
  label: string;
  /** The arithmetic, written out. */
  expression: string;
  detail?: string;
  result: string | number;
  sourceId: string;
}

export interface Profile {
  input: BirthInput;
  mulank: NumberFact;
  bhagyank: NumberFact;
  namank: NumberFact;
  compound: number;
  breakdown: NameBreakdown[];
  planets: { value: number; graha: string; sanskrit: string }[];
  grid: GridCell[];
  lines: GridLine[];
  missing: number[];
  repeated: number[];
  kua: { value: number; group: 'east' | 'west'; note: string; directions: { good: string[]; bad: string[] } } | null;
  timing: TimingPoint[];
  provenance: ProvenanceRef[];
  /** Every step, in order. The UI renders this verbatim. */
  trace: TraceStep[];
  /** The reading layer: what each core number is said to mean. */
  reading: {
    mulank: NumberReading;
    bhagyank: NumberReading;
    namank: NumberReading;
    harmony: { pair: [number, number]; relation: 'friend' | 'neutral' | 'enemy'; line: string }[];
    missing: { n: number; text: string }[];
    repeated: { n: number; text: string }[];
  };
  /** Lucky elements, taken from the ruling planet of the mūlāṅka. */
  lucky: {
    numbers: number[];
    days: string[];
    colours: string[];
    gemstone: string;
    mantra: string;
    direction: string;
  };
}
