import { FilePreview } from '@/ui/organisms/FilePreview/FilePreview';
import { useExplorer } from '@/hooks/useExplorer';
import { useFilePreview } from '@/hooks/useFilePreview';

export function FilePreviewContainer() {
  const { selectedId } = useExplorer();
  const { data: node, isLoading, isFetching } = useFilePreview(selectedId);

  const nothingSelected = selectedId === null;

  return (
    <FilePreview
      node={node ?? null}
      // isLoading: no data at all yet — show skeleton
      isLoading={isLoading && !nothingSelected}
      // isFetching: data exists from a previous selection but new one is in-flight — dim the content
      isFetching={isFetching && !isLoading && !nothingSelected}
    />
  );
}
