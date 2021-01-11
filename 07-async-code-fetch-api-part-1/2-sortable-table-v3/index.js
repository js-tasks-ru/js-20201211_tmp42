import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  data = [];
  subElements = {};
  loading = false;
  step = 10;
  start = 1;
  end = this.start + this.step;

  constructor(header = [], {
    url = "",
    isSortOnServer = true,
    sorted = {
      field: header.find(item => item.sortable).id,
      order: 'asc'
    }
  } = {}) {
    this.header = header;
    this.url = new URL(url, BACKEND_URL);
    this.isSortOnServer = isSortOnServer;
    this.sorted = sorted;
    this.render();
  }

  async render() {
    const div = document.createElement('div');
    div.innerHTML = this.template();

    this.element = div.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.subElements.header.addEventListener('pointerdown', this.sortHandler);

    document.addEventListener('scroll', this.scrollHandler);
    await this.getData();
  }

  scrollHandler = async () => {
    const clientHeight = document.documentElement.clientHeight;
    const documentBottom = document.documentElement.getBoundingClientRect().bottom;

    if (clientHeight >= documentBottom && !this.loading && this.isSortOnServer) {
      this.loading = true;
      const data = await this.loadData();
      this.data = [...this.data, ...data];
      this.update(this.data);
      this.loading = false;
    }
  }

  async getData () {
    const data = await this.loadData();
    this.data = [...data];
    this.update(data);
  }

  async loadData (field = this.sorted.field, order = this.sorted.order, start = this.start, end = this.end) {
    this.url.searchParams.set("_sort", field);
    this.url.searchParams.set("_order", order);
    this.url.searchParams.set("_start", start);
    this.url.searchParams.set("_end", end);

    this.element.classList.add('sortable-table_loading');
    const data = await fetchJson(this.url);
    this.element.classList.remove('sortable-table_loading');

    return data;
  }

  update (data) {
    this.start = this.end;
    this.end = this.start + this.step;
    return this.subElements.body.innerHTML = this.getTable(data);
  }

  sortHandler = event => {
    const currentSortItem = event.target.closest('[data-sortable=true]');

    if (!currentSortItem) return;

    const toggleSort = (direction) => {
      const order = {
        'asc': 'desc',
        'desc': 'asc',
      };
      return order[direction];
    };

    const arrow = currentSortItem.querySelector('.sortable-table__sort-arrow');
    const { id, order } = currentSortItem.dataset;

    currentSortItem.dataset.order = toggleSort(order);

    this.sorted = { field: id, order: toggleSort(order) };

    if (!arrow)
      currentSortItem.append(this.subElements.arrow);

    if (this.isSortOnServer) {
      this.sortOnServer(id, toggleSort(order));
    } else {
      this.sortLocally(id, toggleSort(order));
    }
  };

  sortOnServer = async (field, order) => {
    const data = await this.loadData(field, order, 1, this.step);
    this.data = [...data];
    this.end = this.step;
    this.update(data);
  };

  sortLocally = (field, order) => {
    const sortTable = this.sortTable(field, order);
    this.subElements.body.innerHTML = this.getTable(sortTable);
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
      <div data-element="productsContainer" class="products-list__container">
        <div class="sortable-table" style="max-width: 1000px; margin: 20px auto;">
          <div data-element="header" class="sortable-table__header sortable-table__row">
            ${this.getHeader(this.header)}
          </div>
          <div data-element="body" class="sortable-table__body"></div>
        </div>
        </div>
      </div>
    `;
  }

  getHeader (arr, {field, order} = this.sorted) {
    return arr.map(({title, id, sortable}) => {
      return `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${field === id ? order : this.sorted.order}">
          <span>${title}</span>
          ${id === field ? this.arrow() : ''}
        </div>`;
    }).join('');
  }

  arrow () {
    return `
      <span data-element='arrow' class="sortable-table__sort-arrow">
        <span class="sort-arrow"/>
      </span>
    `;
  }

  getTable (products) {
    return products.reduce((acc, product) => [...acc, this.getTableRow(product)], []).join('');
  }

  getTableRow (product) {
    return `
      <a href="/products/${product.id}" class="sortable-table__row">
        ${
      this.header.map(
        item => (item.template) ? item.template(product[item.id]) : `<div class="sortable-table__cell">${product[item.id]}</div>`
      ).join('')
    }
      </a>
    `;
  }

  sortTable(field, order = this.sortDefault.order) {
    const sortTable = [...this.data];
    const currentHeaderItem = this.header.find(item => item.id === field);
    const {sortType, customSorting} = currentHeaderItem;

    return sortTable.sort((item1, item2) => {
      const a = item1[field];
      const b = item2[field];
      const sortDirection = order === 'asc' ? 1 : -1;

      switch (sortType) {
      case 'number':
        return sortDirection * (a - b);
      case 'string':
        return sortDirection * a.localeCompare(b, ['ru', 'en'], {caseFirst: 'upper'});
      case 'custom':
        return sortDirection * customSorting(a, b);
      default:
        return sortDirection * (a - b);
      }
    });
  }

  remove () {
    this.element.remove();
    document.removeEventListener('scroll', this.scrollHandler);
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
