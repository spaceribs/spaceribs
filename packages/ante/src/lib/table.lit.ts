import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * The table element which contains cards and pieces
 */
@customElement('ante-table')
export class AnteTable extends LitElement {
  static override styles = css`
    :host {
      display: block;
      overflow: hidden;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ddd;
    }
  `;

  @property({ type: String }) name = 'Somebody';

  /**
   * Render the example component
   * @returns the rendered template
   */
  override render() {
    return html`<slot></slot>`;
  }
}
