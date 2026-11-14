import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ExternalLink, ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Library',
  description: 'The five books and four notation systems behind the Aṅkita engine, with their dates and licensing status.',
};

const BOOKS = [
  {
    title: 'Book of Numbers',
    author: 'Cheiro (William John Warner)',
    year: 'London, 1926',
    supplies: 'Chaldean letter values; the compound numbers 10–52; digit-to-planet table with Uranus at 4 and Neptune at 7.',
    status: 'verified' as const,
    rights: 'Public domain',
    note: 'The letter table was verified against the book’s own worked example — John Smith → 9 and 8 → 17 → 8.',
  },
  {
    title: 'Numerology: With Tantra, Ayurveda, and Astrology',
    author: 'Harish Johari',
    year: 'Destiny Books, 1990',
    supplies: 'Psychic, name and destiny numbers; the Indian digit-to-graha table; planetary friendships; projection into the future.',
    status: 'verified' as const,
    rights: 'In copyright',
    note: 'Johari states the Rāhu/Ketu substitution in his own words, and notes that the origin of his “Vedic Square” is unknown in India.',
  },
  {
    title: 'Aṅk-Vidyā (Jyotiṣa)',
    author: 'Gopesh Kumar Ojha',
    year: 'Motilal Banarsidass; reprints 1966–1982',
    supplies: 'Indian practice of the 1970s: bhāgyāṅka, nāmāṅka, and the integration of numerology with lagṇa, bhāva and daśā.',
    status: 'verified' as const,
    rights: 'In copyright',
    note: 'Contains no Lo Shu grid and no Kua number — a useful negative control.',
  },
  {
    title: 'A Treatise on Numerology',
    author: 'Cheiro (Ranjan Publications edition)',
    year: 'Delhi, undated',
    supplies: 'An Indian reprint of the 1926 text.',
    status: 'attributed' as const,
    rights: 'Upload marked CC0 by a third party',
    note: 'Image-only scan, no text layer; not used for verification.',
  },
  {
    title: 'The Lo Shu square',
    author: 'Chinese tradition',
    year: '4th c. BCE onward',
    supplies: 'The 3×3 placement, plane lines, missing and repeated digits.',
    status: 'attributed' as const,
    rights: 'Traditional',
    note: 'Labelled Chinese throughout the platform. It is not Vedic and is not presented as such.',
  },
];

const NOTATIONS = [
  { name: 'Bhūtasaṅkhyā', where: 'Piṅgala, Chandaḥsūtra (c. 2nd c. BCE)', what: 'Digits carried by ordinary words — moon 1, eye 2, fire 3, Veda 4 — read units-first.', use: 'Decoding numbers embedded in Sanskrit verse.' },
  { name: 'Kaṭapayādi', where: 'Haridatta, 683 CE; defined in Sadratnamālā, 1819', what: 'Consonants carry digits: ka ṭa pa ya = 1, and so on; na, ña and bare vowels are zero.', use: 'Decoding Kerala chronograms and astronomical numbers.' },
  { name: 'Āryabhaṭa notation', where: 'Āryabhaṭīya, 499 CE', what: 'Class consonants 1–25, unclassed 30–100, vowels mark powers of a hundred.', use: 'Reading the Daśagītika.' },
  { name: 'Nāmākṣara', where: 'Gṛhya-sūtra naming custom; muhūrta literature', what: '108 pada syllables, four per nakṣatra, chosen by the Moon’s position at birth.', use: 'The classical naming rule — a lookup, not a sum.' },
];

const ICON = { verified: ShieldCheck, attributed: ShieldQuestion, unverified: ShieldAlert };
const TONE = { verified: 'text-emerald-700', attributed: 'text-amber-700', unverified: 'text-copper' };

export default function LibraryPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-3xl">
        <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-copper">Library</p>
        <h1 className="mt-2 text-4xl font-serif font-bold text-ink">What the engine is made of</h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          Five books and four notation systems. Each entry carries the date it entered the tradition and
          the licensing position of the copy that was read.
        </p>
      </div>

      <div className="mt-9 grid gap-4 lg:grid-cols-2">
        {BOOKS.map((b) => {
          const Icon = ICON[b.status];
          return (
            <article key={b.title} className="rounded-xl border border-line bg-surface p-6 shadow-3d-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-serif text-lg font-bold text-ink">{b.title}</h2>
                  <p className="mt-1 text-xs font-mono uppercase tracking-wider text-ink-muted">{b.author} · {b.year}</p>
                </div>
                <Icon className={`w-5 h-5 shrink-0 ${TONE[b.status]}`} />
              </div>
              <p className="mt-3 text-sm text-ink-soft leading-relaxed">{b.supplies}</p>
              <p className="mt-3 text-xs text-ink-soft leading-relaxed border-l-2 border-line pl-3">{b.note}</p>
              <div className="mt-4 pt-3 border-t border-line flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">{b.rights}</span>
                <span className={`text-[10px] font-mono uppercase tracking-wider ${TONE[b.status]}`}>{b.status}</span>
              </div>
            </article>
          );
        })}
      </div>

      <h2 className="mt-12 text-2xl font-serif font-bold text-ink">Four classical notations</h2>
      <p className="mt-2 text-sm text-ink-soft max-w-3xl">
        These are offered as decoders. None of them assigns a meaning to a number; all four exist so that a
        number can be written inside a verse.
      </p>
      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-canvas border-b border-line text-left">
              {['System', 'Earliest evidence', 'How it works', 'Used for'].map((h) => (
                <th key={h} className="px-4 py-3 text-[10px] font-mono uppercase tracking-[0.16em] text-ink-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {NOTATIONS.map((n) => (
              <tr key={n.name} className="align-top">
                <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{n.name}</td>
                <td className="px-4 py-3 text-ink-soft">{n.where}</td>
                <td className="px-4 py-3 text-ink-soft">{n.what}</td>
                <td className="px-4 py-3 text-ink-soft">{n.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/tools" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-ink text-surface text-[11px] font-mono uppercase tracking-wider hover:bg-copper-dark">
          <BookOpen className="w-3.5 h-3.5" /> Open the decoders
        </Link>
        <Link href="/method" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line-strong text-[11px] font-mono uppercase tracking-wider text-ink hover:border-copper/40">
          How the rules are applied <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
