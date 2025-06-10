import type { Meta, StoryObj } from '@storybook/svelte';
import Typography from './Typography.svelte';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'],
    },
    weight: {
      control: 'select',
      options: ['bold', 'semibold', 'medium', 'regular'],
    },
   
  }
} satisfies Meta<Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Heading1: Story = {
  args: {
    variant: "h3",
    weight: "medium",
    className: "",
    slot:'Heading 1'

  },
  render: (args) => ({
    Component: Typography ,
    props: args,
  })
};

export const Heading2: Story = {
  args: {
    variant: 'h2',
    weight: 'bold',
    slot:'Heading 2'

  },
  render: (args) => ({
    Component: Typography,
    props: args,
  })
};

export const Heading3: Story = {
  args: {
    variant: 'h3',
    weight: 'bold',
    slot: 'Heading 3'

  },
  render: (args) => ({
    Component: Typography,
    props: args,
  })
};


export const Paragraph: Story = {
  args: {
    variant: 'p',
    weight: 'regular',
    slot: 'This is a paragraph text example that shows how longer content appears.'

  },
  render: (args) => ({
    Component: Typography,
    props: args,
  })
};


export const CustomStyled: Story = {
  args: {
    variant: "h1",
    weight: 'bold',
    className: 'text-blue-500 italic underline',
    slot: 'Custom Styled Text'

  },
  render: (args) => ({
    Component: Typography,
    props: args,
  })
};