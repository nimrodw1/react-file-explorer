import { ExplorerLayout } from '@/ui/templates/ExplorerLayout/ExplorerLayout';
import { OmnibarContainer } from '@/containers/OmnibarContainer';
import { FileTreeContainer } from '@/containers/FileTreeContainer';
import { FilePreviewContainer } from '@/containers/FilePreviewContainer';

export function ExplorerPage() {
  return (
    <ExplorerLayout
      omnibar={<OmnibarContainer />}
      tree={<FileTreeContainer />}
      preview={<FilePreviewContainer />}
    />
  );
}
