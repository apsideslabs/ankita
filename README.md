# Aṅkita · अङ्कित

**Number, read from its sources.**

A numerology workspace where every figure carries its citation. Aṅkita computes the
standard readings — mūlāṅka, bhāgyāṅka, nāmāṅka, the Lo Shu grid, the Kua number, the
personal cycles — and prints, next to each one, which tradition it came from and when
that tradition began.

Most numerology merges a 1926 London letter table, a 1990 Indian graha scheme and a
Chinese number square, then calls the result ancient. Aṅkita keeps the three apart and
labels them in the interface.

---

## What it computes

| Output | Rule | Source |
|---|---|---|
| Mūlāṅka (psychic) | day of birth, reduced | graha-numerology, Johari 1990 |
| Bhāgyāṅka (destiny) | full date, reduced | graha-numerology, Johari 1990 |
| Nāmāṅka (name) | Chaldean letters, word-reduced then summed | Cheiro, *Book of Numbers* 1926 |
| Compound number | the unreduced sum, 10–52 | Cheiro, ch. XIII |
| Digit → graha | 1 Sun … 9 Mars, with Rāhu 4 and Ketu 7 | Johari 1990 (Indian variant of Cheiro's Uranus/Neptune) |
| Friendships | 9×9 natural friendship of the grahas | Johari 1990 |
| Lo Shu grid | 4 9 2 / 3 5 7 / 8 1 6, lines, missing, repeated | Chinese — labelled as such |
| Kua number | both branches, 1900s and 2000s | compass-school Feng Shui — Chinese |
| Personal cycles | year, month, day, and the 45-year digit cycle | modern literature — not a classical daśā |
| Bhūtasaṅkhyā | word-numerals, decoded and encoded | Piṅgala, Chandaḥsūtra (c. 2nd c. BCE) |
| Kaṭapayādi | consonant code, decoded | Haridatta, 683 CE |
| Nāmākṣara | 108 pada syllables | Gṛhya-sūtra naming custom |

## What it refuses to do

- Print a figure whose rule it cannot name.
- Claim a Vedic pedigree for the digit-to-graha table. No classical Sanskrit text links
  the digits to the grahas; the pairing is twentieth-century, and the interface says so
  on the page where it is used.
- Present the Lo Shu grid or the Kua number as Indian.
- Promise an outcome. The engine computes; the reading is the reader's.

## The six corrections

The engine differs from the circulating formulas in six documented places — the Kua
1900s/2000s branch, the mislabelled "Vedic dasha", the modern Lo Shu line names, the
reason 9 is unassigned, master numbers, and the fact that compound numbers stop at 52.
All six are on `/method`.

---

## Pages

| Route | What it is |
|---|---|
| `/` | Hero, the three layers, an inline console that computes on the page |
| `/workspace` | The full console — chart, grid, timing, name, and a provenance table |
| `/library` | The five books and four notation systems, with dates and licence status |
| `/method` | The three layers, the six corrections, what is verified and what is not |
| `/tools` | Bhūtasaṅkhyā, kaṭapayādi and nāmākṣara decoders |
| `/about` | The platform, the family (Gaṇaka, Phalita), the licence |

## Engine

`lib/engine` is pure TypeScript with no dependencies. One function does the work:

```ts
import { buildProfile } from '@/lib/engine/profile';

const profile = buildProfile({
  name: 'John Smith',
  date: '1995-08-29',
  gender: 'male',
  masterNumbers: false,
});
```

```
mulank   2   (29 → 11 → 2)
bhagyank 7   (2+9+0+8+1+9+9+5 = 43 → 7)
namank   8   (John 9 + Smith 8 = 17 → 8)
```

Same input, same output, always. Nothing leaves the browser.

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # 13 engine tests, checked against the sources' own examples
npm run build
```

The test suite verifies the engine against worked examples printed in the books —
Cheiro's John Smith name (9 + 8 = 17 → 8), the blueprint's 29-08-1995 (→ 2 / 7), the
magic sum of the Lo Shu square, the standard bhūtasaṅkhyā and kaṭapayādi illustrations,
and the Kua branches for 1995 and 2005.

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · lucide-react. No runtime
dependencies in the engine, no network calls, no telemetry.

## Licence

MIT. The sources cited in `/library` remain the property of their authors.

---

An [Apsides Labs](https://github.com/apsideslabs) product, alongside
[Gaṇaka](https://github.com/apsideslabs/ganaka) (calculation) and
[Phalita](https://github.com/apsideslabs/phalita) (prediction).
