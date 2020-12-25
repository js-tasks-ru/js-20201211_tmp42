export default class ColumnChart {
  chartHeight = 50;
  chart;

  constructor({data = [], label = '', value = 0, link = ''}={}) {
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;

    this.render();
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = `
  <div class="column-chart" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        ${this.getLink(this.link)}
      </div>
       <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.value}</div>
        <div data-element="body" class="column-chart__chart">
 ${this.getValue(this.data)}
        </div>
      </div>

    `;
    if (!this.data.length) {
      element.querySelector('.column-chart').className = 'column-chart column-chart_loading';
    }

    this.chart = element.querySelector('.column-chart__chart');
    // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
    // который мы создали на строке 7
    this.element = element.firstElementChild;
  }

  getLink(linkq) {
    if (linkq) {
      return `<a class="column-chart__link" href="${linkq}">View all</a>`;
    } else {
      return ``;
    }
  }

  getValue(arr) {
    let stringItem = '';
    const max = Math.max(...arr);
    const scale = this.chartHeight / max;
    if (arr.length) {
      for (let i = 0; i < arr.length; i++) {
        const persent = Math.round(arr[i] * 100 / max);
        stringItem += `<div style="--value: ${Math.floor(arr[i]* scale)}" data-tooltip="${persent}%"></div>`;
      }
    }
    return stringItem;
  }

  remove() {
    this.element.remove();
  }

  update(newData) {
    return this.chart.innerHTML = this.getValue(newData);
  }

  destroy() {
    this.remove();
    this.chart = '';
    // NOTE: удаляем обработчики событий, если они есть
  }
}
