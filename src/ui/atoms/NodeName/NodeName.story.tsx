import type { Meta, StoryObj } from '@storybook/react';
import { NodeName } from './NodeName';

const meta: Meta<typeof NodeName> = {
  title: 'atoms/NodeName',
  component: NodeName,
  argTypes: {
    muted: { control: 'boolean' },
    name: { control: 'text' },
  },
};
export default meta;
type Story = StoryObj<typeof NodeName>;

export const Default: Story = { args: { name: 'Project Brief.pdf' } };
export const Muted: Story = { args: { name: 'Archive', muted: true } };
export const LongName: Story = {
  args: { name: 'This is a very long file name that should be truncated with ellipsis.docx' },
};

export const Interactive: Story = {
  args: { name: 'My Document.pdf', muted: false },
};
