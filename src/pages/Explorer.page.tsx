import { FilePreviewContainer } from '@/containers/FilePreviewContainer';
import { FileTreeContainer } from '@/containers/FileTreeContainer';
import { FilterResultsContainer } from '@/containers/FilterResultsContainer';
import { OmnibarContainer } from '@/containers/OmnibarContainer';
import { useFilterParams } from '@/hooks/useFilterParams';
import { isFilterActive } from '@/types/filters';
import { ExplorerLayout } from '@/ui/templates/ExplorerLayout/ExplorerLayout';

export function ExplorerPage() {
  const { activeFilter } = useFilterParams();
  const filterActive = isFilterActive(activeFilter);

  return (
    <ExplorerLayout
      omnibar={<OmnibarContainer />}
      tree={filterActive ? <FilterResultsContainer /> : <FileTreeContainer />}
      preview={<FilePreviewContainer />}
    />
  );
}
