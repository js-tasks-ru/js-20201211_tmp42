export default class SortableTable {
  element;
  subElements = {};
  sortDefault = {
    field: 'title',
    order: 'asc',
  };

  constructor(header = [], { data = [] } = {}) {
    this.header = header;
    this.data = data;
    this.render();
  }

  render() {
    const div = document.createElement('div');
    div.innerHTML = this.template();

    this.element = div.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.subElements.header.addEventListener('pointerdown', this.sortHandler);
    this.sortTable(this.sortDefault.field, this.sortDefault.order);
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

    if (!arrow)
      currentSortItem.append(this.subElements.arrow);

    this.sortTable(id, toggleSort(order));
  };

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
          <div data-element="body" class="sortable-table__body">
            ${this.getTable(this.data)}
          </div>
        </div>
      </div>
    `;
  }

  getHeader (arr, {field, order} = this.sortDefault) {
    return arr.map(({title, id, sortable}) => {
      return `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${field === id ? order : this.sortDefault.order}">
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
      <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
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

    sortTable.sort((item1, item2) => {
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
        return sortDirection * (a[id] - b[id]);
      }
    });
    return this.subElements.body.innerHTML = this.getTable(sortTable);
  }

  remove () {
    this.element.remove();
    this.subElements = {};
  }

  destroy() {
    this.remove();

    // additionally needed to remove all listeners...
  }
}
