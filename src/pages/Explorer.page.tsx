import { ExplorerLayout } from '@/ui/templates/ExplorerLayout/ExplorerLayout';
import { OmnibarContainer } from '@/containers/OmnibarContainer';
import { FileTreeContainer } from '@/containers/FileTreeContainer';
import { FilePreviewContainer } from '@/containers/FilePreviewContainer';
import { useExplorer } from '@/hooks/useExplorer';

export function ExplorerPage() {
  const { navPanelWidth, setNavPanelWidth } = useExplorer();

  return (
    <ExplorerLayout
      navWidth={navPanelWidth}
      onNavWidthChange={setNavPanelWidth}
      omnibar={<OmnibarContainer />}
      tree={<FileTreeContainer />}
      preview={<FilePreviewContainer />}
    />
  );
}
