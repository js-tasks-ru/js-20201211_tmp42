class Tooltip {
  element;
  static tooltipInstance;

  constructor () {
    if (Tooltip.tooltipInstance) {
      return Tooltip.tooltipInstance;
    }
    Tooltip.tooltipInstance = this;
  }

  initialize() {
    const tooltips = document.querySelector('[data-tooltip]');

    if (tooltips) {
      document.addEventListener('pointerover', this.showTooltip);
      document.addEventListener('pointerout', this.removeTooltip);
    }
  }

  showTooltip = event => {
    const tooltipElement = event.target.closest('[data-tooltip]');
    if (!tooltipElement) return;

    this.render(tooltipElement.dataset.tooltip);
    this.moveTooltip(event);

    document.addEventListener('pointermove', this.moveTooltip);
  };

  moveTooltip = event => {
    this.element.style = `left:${event.clientX + 10}px; top: ${event.clientY + 10}px;`;
  };

  render(html) {
    const div = document.createElement('div');
    div.className = "tooltip";
    div.innerHTML = html;

    this.element = div;

    document.body.append(this.element);
  }

  removeTooltip = () => {
    if (this.element) {
      this.element.remove();
      this.element = null;

      document.removeEventListener('pointermove', this.moveTooltip);
    }
  };

  destroy () {
    document.removeEventListener('pointerover', this.showTooltip);
    document.removeEventListener('pointerout', this.removeTooltip);
    this.removeTooltip();
  }
}

const tooltip = new Tooltip();

export default tooltip;
