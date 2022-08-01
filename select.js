const getTemplate = (data = [], placeholder, selectedId, selectField) => {
    let text = placeholder ?? 'Placeholder';
    const selectFieldhtml = selectField ? selectField.outerHTML : '';
    const items = data.map(item => {
        let classes = '';

        if( item.id === selectedId) {
            classes = 'selected';
            text = item.value; 
        }
        return `<li class="select__item ${classes}" data-type="item" data-id="${item.id}">${item.value}</li>`;
    })
        .join('');

    return `
    ${selectFieldhtml}
    <div class="select__backdrop" data-type="backdrop"></div>
    <div class="select__input" data-type="input">
        <span data-type="value">${text}</span>
        <i class="select__icon" data-type="arrow"></i>
    </div>
    <div class="select__dropdown">
        <ul class="select__list">
            ${items}
        </ul>
    </div>
    `;
}
class Select {
    constructor(selector, options) {
        this.$el = document.querySelector(selector);
        this.options = options;
        this.selectedId = this.options.selectedId;
        this.#render();
        this.#setup();
    }

    #render() {
        let {placeholder, data} = this.options;
        this.$el.classList.add('select');
        this.$select = this.$el.querySelector('select');
        if( this.$Select ) {
            this.$select.style = 'display:none';
            let items = [];
            let i = 0;
            const selectOptions = this.$select.querySelectorAll('option');
            selectOptions.forEach(item => {
                items[i++] = {id:`${item.getAttribute('value')}`, value:`${item.textContent}`};
            });

            if( items.length > 0 ){
                this.options.data = data = items;
            }
        }

        this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId, this.$select);
    }

    #setup(){
        this.clickHandler = this.clickHandler.bind(this);
        this.$el.addEventListener('click', this.clickHandler);
        this.$value = this.$el.querySelector('[data-type="value"]');
    }

    clickHandler(event) {
        const {type} = event.target.dataset;

        if(type === 'input'){
            this.toggle();
        } else if(type === 'item') {
            const id = event.target.dataset.id;
            this.select(id);
        } else if (type === 'backdrop') {
            this.close();
        }
    }

    get isOpen() {
        return this.$el.classList.contains('open');
    }

    get current() {
        return this.options.data.find(item => item.id === this.selectedId);
    }

    select(id) {
        this.selectedId = id;
        this.$value.textContent = this.current.value;
        this.$el.querySelectorAll('[data-type="item"]').forEach(el => el.classList.remove('selected'));
        this.$el.querySelector(`[data-id="${this.selectedId}"]`).classList.add('selected');
        if( this.$select ){
            this.$select.value = this.current.value;
            this.$select.dispatchEvent(new Event('change'));
        }
        this.options.onSelect ? this.options.onSelect(this.current) : null;
        this.close();
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.$el.classList.add('open');
    }

    close() {
        this.$el.classList.remove('open');
    }

    destroy(){
        this.$el.removeEventListener('click', this.clickHandler);
        this.$el.innerHTML = '';
    }
}