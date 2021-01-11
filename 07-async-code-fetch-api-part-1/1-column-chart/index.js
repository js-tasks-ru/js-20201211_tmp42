const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class ColumnChart {
  element;
  subElements;
  chartHeight = 50;

  constructor({
    url = '',
    range = {
      from: new Date(),
      to: new Date()
    },
    label = '',
    link = '',
    formatHeading = x => x,
  } = {}) {
    this.url = new URL(url, BACKEND_URL);
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;

    this.render();
    this.loadData();
  }

  render() {
    const div = document.createElement('div');
    div.innerHTML = this.template();

    this.element = div.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  getSubElements (element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((acc, item) => {
      acc[item.dataset.element] = item;
      return acc;
    }, {});
  }

  template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header"></div>
          <div data-element="body" class="column-chart__chart"></div>
        </div>
      </div>
    `;
  }

  getHeaderValue (data) {
    const total = Object.values(data).reduce((acc, item) => acc + item);
    return this.formatHeading(total);
  }

  getLink() {
    const href = this.link;
    return href ? `<a class="column-chart__link" href="${href}">View all</a>` : '';
  }

  loadData (from = this.range.from, to = this.range.to) {
    this.element.classList.add('column-chart_loading');
    this.range = { from, to };

    this.url.searchParams.set('from', from.toISOString());
    this.url.searchParams.set('to', to.toISOString());

    return fetch(this.url.toString())
      .then(response => response.json())
      .then(data => this.updateData(data))
      .catch(error => new Error(error));
  }

  updateData (data) {
    const chart = this.getChart(data);
    if (chart.length) {
      this.subElements.body.innerHTML = chart;
    }
    this.subElements.header.innerHTML = this.getHeaderValue(data);
  }

  getChart(data) {
    const dataValues = Object.values(data);

    if (dataValues.length > 0) {
      this.element.classList.remove('column-chart_loading');
    }
    const max = Math.max(...dataValues);
    const scale = this.chartHeight / max;
    return [...dataValues].map(value => {
      const percent = Math.round(value * 100 / max);
      return `<div data-tooltip="${percent}%" style="--value: ${Math.floor(value * scale)}"></div>`;
    }).join('');
  }

  update(from, to) {
    return this.loadData(from, to);
  }

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
      this.subElements = null;
    }
  }
}
