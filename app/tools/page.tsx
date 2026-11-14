import type { Metadata } from 'next';
import { ToolsView } from '@/components/tools/ToolsView';

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Decode bhūtasaṅkhyā word-numerals, kaṭapayādi consonants and the 108 nāmākṣara naming syllables.',
};

export default function ToolsPage() {
  return <ToolsView />;
}
