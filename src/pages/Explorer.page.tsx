import { FilePreviewContainer } from '@/containers/FilePreviewContainer';
import { FileTreeContainer } from '@/containers/FileTreeContainer';
import { OmnibarContainer } from '@/containers/OmnibarContainer';
import { ExplorerLayout } from '@/ui/templates/ExplorerLayout/ExplorerLayout';

export function ExplorerPage() {
  return (
    <ExplorerLayout
      omnibar={<OmnibarContainer />}
      tree={<FileTreeContainer />}
      preview={<FilePreviewContainer />}
    />
  );
}
