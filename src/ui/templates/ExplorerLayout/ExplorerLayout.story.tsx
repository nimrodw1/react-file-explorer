import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Text } from '@mantine/core';
import { ExplorerLayout } from './ExplorerLayout';

const meta: Meta<typeof ExplorerLayout> = {
  title: 'templates/ExplorerLayout',
  component: ExplorerLayout,
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj<typeof ExplorerLayout>;

const Placeholder = ({ label }: { label: string }) => (
  <Box
    style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--mantine-color-gray-0)',
      height: '100%',
    }}
  >
    <Text c="dimmed" size="sm">
      {label}
    </Text>
  </Box>
);

export const Default: Story = {
  render: () => {
    const [width, setWidth] = useState(280);
    return (
      <ExplorerLayout
        navWidth={width}
        onNavWidthChange={setWidth}
        omnibar={<Placeholder label="Omnibar" />}
        tree={<Placeholder label="File Tree" />}
        preview={<Placeholder label="Preview" />}
      />
    );
  },
};
