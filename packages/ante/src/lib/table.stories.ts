import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import './table.lit';
import './card.lit';

type CustomArgs = { name?: string };

const meta: Meta<CustomArgs> = {
  component: 'ante-table',
  render: ({ name }) => html`
    <ante-table name=${ifDefined(name)}>
      <ante-card></ante-card>
      <ante-card></ante-card>
    </ante-table>
  `,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<CustomArgs>;

export const Primary: Story = {
  args: {
    name: 'test',
  },
};
