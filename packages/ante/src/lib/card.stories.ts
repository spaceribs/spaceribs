import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import './card.lit';

type CustomArgs = { name?: string };

const meta: Meta<CustomArgs> = {
  component: 'ante-card',
  render: ({ name }) => html`<ante-card name=${ifDefined(name)}></ante-card>`,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<CustomArgs>;

export const Primary: Story = {
  args: {
    name: 'test',
  },
};
