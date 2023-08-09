class SearchField extends HTMLElement {
    constructor() {
        super()
        this.build()
    }

    build() {
        const shadow = this.attachShadow({ mode: "open" })
        shadow.appendChild(this.styles())
        shadow.appendChild(this.links())
        const div = this.createField()
        this.tds = [];

        shadow.appendChild(div);

        this.getData()
        this.selectData()

        this.wrapperFocus('focusin', true)
        this.wrapperFocus('focusout', false)
    }

    createField() {
        const div = this.createWrapper();
        this.createInput();
        const button = this.createButton();
        const icon = this.createIcon();

        button.appendChild(icon)

        this.wrap.appendChild(this.input)
        this.wrap.appendChild(button)
        return div
    }

    filterValues(tds, value, match) {
        return tds.filter(td => match ? td.textContent.includes(value) : !td.textContent.includes(value))
    }

    filterTable() {
        const value = this.input.value
        this.filterValues(this.tds, value, false)
            .forEach(td => {
                td.parentElement.classList.add('hidden')
            })
        this.filterValues(this.tds, value, true)
            .forEach(td => {
                td.parentElement.classList.remove('hidden')
            })
    }

    selectData() {
        const ul = document.createElement('ul')
        ul.classList.add('list')
        ul.addEventListener('click', (event) => {
            this.input.value = event.target.textContent
            this.filterTable()
        })

        this.input.addEventListener('input', (event) => {
            const search = event.target.value.trim().toLowerCase()
            const matchingText = this.tds.filter(td => {
                const text = td.textContent.toLowerCase()
                if (search) {
                    return text.includes(search)
                } else {
                    this.tds.forEach(td => td.parentElement.classList.remove('hidden'))
                }
            })
            ul.childElementCount ? ul.innerHTML = '' : false;
            matchingText.forEach(text => {
                const li = document.createElement('li')
                li.textContent = text.textContent
                ul.appendChild(li)
            })
            this.select.appendChild(ul)
        })
    }

    getData() {
        const id = this.dataset.target
        const tds = document.querySelectorAll(`#${id} tr td`)
        tds.forEach(td => {
            this.tds.push(td)
        })
    }

    createIcon() {
        const icon = document.createElement("i")
        icon.classList.add("fas")
        icon.classList.add("fa-magnifying-glass")
        return icon
    }

    createButton() {
        const button = document.createElement("button")
        button.classList.add("search-button")
        button.addEventListener("click", this.inputFocus.bind(this))
        return button
    }

    createInput() {
        this.input = document.createElement("input")
        this.input.setAttribute("type", "text")
        this.input.classList.add("search-input")
    }

    createWrapper() {
        const div = document.createElement("div")
        div.classList.add("search")

        this.wrap = document.createElement("div")
        this.wrap.classList.add("search-wrapper")
        this.wrap.id = 'wrap'

        this.select = document.createElement("div")
        this.select.classList.add("select")
        this.select.id = 'select_box'
        div.appendChild(this.wrap)
        div.appendChild(this.select)

        return div
    }

    inputFocus() {
        this.input.focus()
        this.wrap.classList.add("foco")
    }

    wrapperFocus(eventType, addClass) {
        if (addClass) {
            this.input.addEventListener(eventType, () => {
                this.wrap.classList.add('foco')
                this.select.classList.remove('hidden')
            })
        } else {
            this.input.addEventListener(eventType, () => {
                this.wrap.classList.remove('foco')
                setTimeout(() => {
                    this.select.classList.add('hidden')
                }, 75);
            })
        }
    }

    links() {
        const link = document.createElement("link")
        link.setAttribute("rel", "stylesheet")
        link.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css")
        link.setAttribute("integrity", "sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==")
        link.setAttribute("crossorigin", "anonymous")
        link.setAttribute("referrerpolicy", "no-referrer")
        return link
    }

    styles() {
        const style = document.createElement("style")
        style.textContent = `
        .hidden{
            display: none;
        }
        .list{
            list-style-type: none;
            padding-inline: 8px;
            margin: 0px;
        }
        .list li{
            cursor:pointer;
            border-bottom: 1px solid #cccccc;
            padding: 4px 0px
        }
        .list li:last-child{
            border:none
        }
        .select{
            width:200px;
            background: white;
            color: black;
            margin: -3px 0px;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
        }
        .search-wrapper {
            display: flex;
            align-items: center;
        }
        .search {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin: 6px 0px;
        }

        .search-input {
            border: none;
            border-radius: 4px 0 0 4px;
            padding: 10px;
            font-size: 16px;
            width: 200px;
            box-sizing: border-box;
            outline: none;
        }

        .foco {
            border-width: 1px 1px;
            border-style: solid;
            border-color: rgb(158, 158, 158);
            border-radius: 6px;
        }

        .search-button {
            background-color: #ffffff;
            border: none;
            border-radius: 0 4px 4px 0;
            padding: 11.5px;
        }`
        return style;
    }
}
customElements.define('search-field', SearchField)