import type { Metadata } from 'next';
import { WorkspaceView } from '@/components/workspace/WorkspaceView';

export const metadata: Metadata = {
  title: 'Workspace',
  description: 'Compute mūlāṅka, bhāgyāṅka, nāmāṅka, the Lo Shu grid, Kua and the timing cycles — with provenance for every figure.',
};

export default function WorkspacePage() {
  return <WorkspaceView />;
}
