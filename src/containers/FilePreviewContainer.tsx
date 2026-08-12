import { useSelectedId } from '@/hooks/useExplorer';
import { useFilePreview } from '@/hooks/useFilePreview';
import { FilePreview } from '@/ui/organisms/FilePreview/FilePreview';

export function FilePreviewContainer() {
  const selectedId = useSelectedId();
  const { data, isLoading, isFetching } = useFilePreview(selectedId);

  const nothingSelected = selectedId === null;

  return (
    <FilePreview
      node={data?.node ?? null}
      path={data?.path}
      // isLoading: no data at all yet — show skeleton
      isLoading={isLoading && !nothingSelected}
      // isFetching: data exists from a previous selection but new one is in-flight — dim the content
      isFetching={isFetching && !isLoading && !nothingSelected}
    />
  );
}
