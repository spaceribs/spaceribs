import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * The initial card element
 */
@customElement('ante-card')
export class AnteCard extends LitElement {
  @state() private dragging = false;
  @state() private hovered = false;
  @state() private flipped = false;

  @state() private xpos = 0;
  @state() private ypos = 0;

  static override styles = css`
    :host {
      position: relative;
      perspective: 500px;
      perspective-origin: center center;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0.4in 0.1in;
      transform-style: preserve-3d;
      background-color: var(--item-size);
    }

    #card-container {
      transition: 0.2s cubic-bezier(0.16, 1, 0.3, 1) box-shadow;
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
      transform-style: preserve-3d;
      cursor: grab;
      &.dragging {
        visibility: hidden;
        cursor: grabbing;
        #back {
          opacity: 0;
        }
      }
      &.hovered {
        box-shadow:
          0mm 11mm 22mm -10mm rgba(0, 0, 0, 0.2),
          0mm 8mm 11mm -8mm rgba(0, 0, 0, 0.1),
          0 6mm 14mm -4mm rgba(0, 0, 0, 0.25);

        #controls {
          opacity: 1;
        }
      }
      &.flipped {
        #controls {
          transform-origin: center center;
          transform: rotateY(180deg) translateZ(10mm);
        }
      }
    }

    #card {
      position: relative;
      width: var(--ante-card-width, 2.5in);
      height: var(--ante-card-height, 3.5in);
      background: var(--ante-card-background-color, #fefefe);
      border-radius: var(--ante-card-corner-radius, 3.5mm);
      transform-style: preserve-3d;
      box-shadow:
        -0.3mm -0.1mm 0 rgba(255, 255, 255, 1),
        0.1mm 0.3mm 0 rgba(190, 190, 190, 1);
      transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1) all;
      transform: translateX(var(--ante-card-translateX, 0in))
        translateY(var(--ante-card-translateY, 0in))
        translateZ(var(--ante-card-translateZ, 0in))
        rotateX(var(--ante-card-rotateX, 0deg))
        rotateY(var(--ante-card-rotateY, 0deg))
        rotateZ(var(--ante-card-rotateZ, 0deg));
    }

    #controls {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      transform: translateZ(10mm);
      opacity: 0;
      .flip {
        position: absolute;
        top: -5mm;
        right: -5mm;
        border: transparent none;
        background: rgba(0, 0, 0, 0.2);
        color: transparent;
        cursor: ne-resize;
        width: 20mm;
        height: 20mm;
        &::before {
          content: ' ';
          position: absolute;
          left: 50%;
          bottom: 50%;
          width: 0;
          height: 0;
          border: 2mm solid #000;
          border-left-color: transparent;
          border-bottom-color: transparent;
        }
        &::after {
          content: ' ';
          position: absolute;
          left: 50%;
          bottom: 50%;
          width: 0;
          height: 0;
          border: 2mm solid #000;
          border-left-color: transparent;
          border-bottom-color: transparent;
        }
      }
    }

    #front {
      overflow: hidden;
      background: #eee;
      position: absolute;
      top: var(--ante-card-bleed, 2mm);
      left: var(--ante-card-bleed, 2mm);
      bottom: var(--ante-card-bleed, 2mm);
      right: var(--ante-card-bleed, 2mm);
      transform: translateZ(0.1mm);
    }

    #back {
      overflow: hidden;
      background: #c0c2ff;
      position: absolute;
      top: var(--ante-card-bleed, 2mm);
      left: var(--ante-card-bleed, 2mm);
      bottom: var(--ante-card-bleed, 2mm);
      right: var(--ante-card-bleed, 2mm);
      transform: translateZ(-0.1mm) rotateY(180deg);
    }
  `;

  @property({ type: String }) name = 'Somebody';

  private transform(): string {
    const startX = this.flipped ? 180 : 0;
    if (this.hovered === false) {
      return `rotateY(${startX}deg) rotateX(${startX}deg)`;
    } else {
      const xdeg = this.xpos * 10 + startX;
      const ydeg = -this.ypos * 10;
      return `translateZ(0.5in) rotateX(${ydeg}deg) rotateY(${xdeg}deg)`;
    }
  }

  private enter() {
    this.hovered = true;
  }

  private leave() {
    this.hovered = false;
  }

  private dragstart() {
    this.dragging = true;
  }

  private dragend() {
    this.dragging = false;
  }

  private move(e: PointerEvent) {
    this.xpos = (this.offsetWidth / 2 - e.offsetX) / this.offsetWidth;
    this.ypos = (this.offsetHeight / 2 - e.offsetY) / this.offsetHeight;
  }

  private flip() {
    this.flipped = !this.flipped;
  }

  /**
   * Render the example component
   * @returns the rendered template
   */
  override render() {
    const cardStyles = {
      '--ante-card-pointerX': this.xpos,
      '--ante-card-pointerY': this.ypos,
    };
    const containerClasses = {
      hovered: this.hovered,
      dragging: this.dragging,
      flipped: this.flipped,
    };
    return html`
      <div
        @pointerenter="${this.enter}"
        @pointerleave="${this.leave}"
        @pointermove="${this.move}"
        @dragstart="${this.dragstart}"
        @dragend="${this.dragend}"
        draggable="true"
        class=${classMap(containerClasses)}
        id="card-container"
      >
        <div id="card" style=${styleMap(cardStyles)}>
          <div id="front" slot="front">front</div>
          <div id="back" slot="back">back</div>
          <div id="controls">
            <button class="flip" title="Flip Over" @click="${this.flip}">
              Flip
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
