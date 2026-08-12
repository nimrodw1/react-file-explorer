import {
  IconFile,
  IconFileMusic,
  IconFileText,
  IconFolder,
  IconFolderOpen,
  IconMovie,
  IconPhoto,
} from '@tabler/icons-react';
import type { FileCategory } from '@/types/fileSystem';

export interface FileCategoryIconProps {
  category: FileCategory | 'folder';
  folderOpen?: boolean;
  size?: number;
  className?: string;
}

const ICON_MAP: Record<FileCategory | 'folder', React.ElementType> = {
  document: IconFileText,
  music: IconFileMusic,
  image: IconPhoto,
  video: IconMovie,
  folder: IconFolder,
};

const FOLDER_OPEN_ICON = IconFolderOpen;

const COLOR_MAP: Record<FileCategory | 'folder', string> = {
  document: 'var(--mantine-color-blue-6)',
  music: 'var(--mantine-color-grape-6)',
  image: 'var(--mantine-color-green-6)',
  video: 'var(--mantine-color-orange-6)',
  folder: 'var(--mantine-color-yellow-6)',
};

export function FileCategoryIcon({
  category,
  folderOpen = false,
  size = 18,
  className,
}: FileCategoryIconProps) {
  const IconComponent =
    category === 'folder' && folderOpen ? FOLDER_OPEN_ICON : (ICON_MAP[category] ?? IconFile);

  return (
    <IconComponent
      size={size}
      stroke={1.5}
      color={COLOR_MAP[category]}
      className={className}
      aria-hidden
    />
  );
}
