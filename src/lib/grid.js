import { span, input } from 'htmlmodule'
import { NodeInit } from 'htmlmodule/lib/nodeinit'
import { Instance } from './Instance'
import { ENTER, ESCAPE, SPACE, BACKSPACE, ARROWS, DIGITS, LETTERS } from './keyCodes'

export default class Grid extends Instance {
    constructor(element, init) {
        super(element, {
            role : 'grid',
            className : 'grid',
            mode : 'navigation'
        })
        if(init) this.init(init)
        this.selection = null
        this.cells[0].active = 'true'
    }
    get rows() {
        return this.findAll(Row)
    }
    get cells() {
        return this.findAll(GridCell)
    }
    get multiselectable() {
        return this.element.getAttribute('aria-multiselectable') || 'false'
    }
    set multiselectable(multiselectable) {
        this.element.setAttribute('aria-multiselectable', multiselectable)
    }
    get selected() {
        return this.cells.filter(cell => cell.selected === 'true')
    }
    get disabled() {
        return super.disabled
    }
    set disabled(disabled) {
        super.disabled = disabled
        this.cells.forEach((cell, i) => {
            if(disabled) cell.element.removeAttribute('tabindex')
            else if(!cell.disabled) cell.element.tabIndex = i? -1 : 0
        })
    }
    get active() {
        return this.find(GridCell, ({ active }) => active === 'true')
    }
    set active(cell) {
        this.active.active = 'false'
        cell.active = 'true'
    }
    unselect() {
        this.selected.forEach(cell => cell.selected = 'false')
        this.selection = null
    }
    merge(cells) {
        const first = cells[0]
        const last = cells[cells.length - 1]
        cells.forEach(cell => {
            cell.selected = 'false'
            if(cell !== first) {
                first.merged.push(cell)
                cell.span = first
                cell.value = ''
                cell.hidden = true
            }
        })
        first.element.colSpan = last.index - first.index + 1
        first.element.rowSpan = last.row.index - first.row.index + 1
        first.mode = 'edit'
    }
    selectAll() {
        const rows = this.rows
        const firstRowCells = rows[0].cells
        const lastRowCells = rows[rows.length - 1].cells
        const topLeftCell = firstRowCells[0]
        const topRightCell = firstRowCells[firstRowCells.length - 1]
        const bottomLeftCell = lastRowCells[0]
        const bottomRightCell = lastRowCells[lastRowCells.length - 1]
        const active = this.active
        let selection
        this.cells.forEach(cell => cell.selected = 'true')
        switch(active) {
            case topLeftCell : selection = bottomRightCell; break
            case topRightCell : selection = bottomLeftCell; break
            case bottomLeftCell : selection = topRightCell; break
            case bottomRightCell : selection = topLeftCell; break
            default : selection = active
        }
        this.selection = selection
    }
    updateSelection(target) {
        const active = this.active
        this.unselect()
        if(active && target !== active) {
            const rowStart = Math.min(active.row.index, target.row.index)
            const rowEnd = Math.max(active.row.index, target.row.index)
            const colStart = Math.min(active.index, target.index)
            const colEnd = Math.max(active.index, target.index)
            const rows = this.rows
            let merged = false
            for(let i = rowStart; i <= rowEnd; i++) {
                let cells = rows[i].cells
                for(let j = colStart; j <= colEnd; j++) {
                    let cell = cells[j]
                    if(cell.span || cell.merged.length) {
                        merged = true
                        break
                    } else cell.selected = 'true'
                }
                if(merged) break
            }
            if(merged) this.selectAll()
            else this.selection = target
        }
    }
}

export function grid(init) {
    return new Grid('table', NodeInit(init))
}

/*================================================================*/

export class Row extends Instance {
    constructor(object, init) {
        super(object, {
            role : 'row',
            className : 'row'
        })
        if(init) this.init(init)
    }
    get grid() {
        return this.closest(Grid)
    }
    get cells() {
        return this.findAll(GridCell)
    }
    get next() {
        return this.grid.rows[this.index + 1]
    }
    get prev() {
        return this.grid.rows[this.index - 1]
    }
    get index() {
        return this.grid.rows.indexOf(this)
    }
}

export function row(init) {
    return new Row('tr', NodeInit(init))
}

/*================================================================*/

const { LEFT, UP, RIGHT, DOWN } = ARROWS
const ARROW_CODES = Object.values(ARROWS)
const DIGIT_CODES = Object.values(DIGITS)
const LETTER_CODES = Object.values(LETTERS)

export class GridCell extends Instance {
    constructor(element, init) {
        super(element, {
            role : 'gridcell',
            className : 'gridcell',
            tabIndex : -1,
        })
        this.init({
            onfocus : this.onFocus.bind(this),
            onclick : this.onClick.bind(this),
            ondblclick : this.onDoubleClick.bind(this),
            onkeydown : this.onKeyDown.bind(this),
            onmouseenter : this.onMouseEnter.bind(this),
            children : this.text = span({ className : 'text' })
        })
        if(init) this.init(init)
        this.span = null
        this.mode = 'navigation'
    }
    get grid() {
        return this.closest(Grid)
    }
    get row() {
        return this.closest(Row)
    }
    get mode() {
        return this.element.dataset.mode
    }
    set mode(mode) {
        if(mode !== this.mode && !this.readonly) {
            const element = this.element
            const input = this.input
            const text = this.text
            if(mode === 'edit') {
                text.hidden = true
                input.hidden = false
                input.focus()
                element.classList.add('focus')
            } else {
                this.value = input.value
                input.hidden = true
                text.hidden = false
                element.classList.remove('focus')
            }
            element.dataset.mode = mode
        }
    }
    set tabIndex(tabIndex) {
        this.element.tabIndex = tabIndex
    }
    get tabIndex() {
        return this.element.tabIndex
    }
    set readonly(readonly) {
        this.element.setAttribute('aria-readonly', readonly)
    }
    get readonly() {
        return this.element.getAttribute('aria-readonly') === 'true'
    }
    set selected(selected) {
        if(this.grid.multiselectable || this.selected) {
            this.element.setAttribute('aria-selected', selected)
        }
    }
    get selected() {
        return this.element.getAttribute('aria-selected') || ''
    }
    set disabled(disabled) {
        const element = this.element
        element.setAttribute('aria-disabled', disabled)
        if(disabled) element.removeAttribute('tabindex')
        else element.tabIndex = -1
    }
    get disabled() {
        return this.grid.disabled ||
            this.element.getAttribute('aria-disabled') === 'true'
    }
    set value(value) {
        this.input.value = this.text.textContent = value
        const { element } = this
        if(value) element.dataset.value = value
        else element.removeAttribute('data-value')
    }
    get value() {
        return this.input.value
    }
    set active(active) {
        this.element.tabIndex = active === 'true'? 0 : -1
    }
    get active() {
        return String(this.element.tabIndex === 0)
    }
    set current(current) {
        this.element.setAttribute('aria-current', current)
    }
    get current() {
        this.element.getAttribute('aria-current') || 'false'
    }
    get leftSibling() {
        const cell = this.row.cells[this.index - 1]
        return cell? cell.span || cell : null
    }
    get rightSibling() {
        return this.row.cells[this.index + this.element.colSpan] || null
    }
    get topSibling() {
        const cell = this.column[this.row.index - 1]
        return cell? cell.span || cell : null
    }
    get bottomSibling() {
        return this.column[this.row.index + this.element.rowSpan] || null
    }
    get index() {
        return this.row.cells.indexOf(this)
    }
    get column() {
        return this.grid.cells.filter(cell => cell.index === this.index)
    }
    get merged() {
        const element = this.element
        const rowSpan = element.rowSpan
        const colSpan = element.colSpan
        const merged = []
        if(rowSpan > 1 || colSpan > 1) {
            const rows = this.grid.rows
            const index = this.index
            const rowIndex = this.row.index
            for(let i = rowIndex; i < rowIndex + rowSpan; i++) {
                const cells = rows[i].cells
                for(let j = index; j < index + colSpan; j++) {
                    const cell = cells[j]
                    if(cell !== this) {
                        cell.span = this
                        merged.push(cell)
                    }
                }
            }
        }
        return merged
    }
    get input() {
        const element = this.element
        let textbox = element.querySelector('input')
        if(!textbox) {
            element.appendChild(textbox =
                input({
                    hidden : true,
                    onblur : this.onInputBlur.bind(this)
                }))
        }
        return textbox
    }
    onInputBlur() {
        this.mode = 'navigation'
    }
    focus() {
        this.span? this.span.focus() : this.element.focus()
    }
    onClick() {
        if(this.mode === 'navigation' && !this.disabled) {
            this.grid.unselect()
            this.selected = 'true'
        }
    }
    onFocus() {
        this.grid.active = this
    }
    onMouseEnter({ buttons }) {
        const grid = this.grid
        if(buttons === 1 && grid.multiselectable === 'true') {
            grid.updateSelection(this)
        }
    }
    onKeyDown(event) {
        const keyCode = event.keyCode
        if(keyCode === ENTER) this.onEnterKeyDown(event)
        else if(keyCode === ESCAPE) this.onEscapeKeyDown(event)
        else if(ARROW_CODES.includes(keyCode) && this.mode === 'navigation') {
            event.preventDefault()
            this.onArrowKeyDown(event)
        }
        else if(keyCode === BACKSPACE) this.onBackspaceKeyDown(event)
        else if(keyCode === LETTERS.A && (event.metaKey || event.ctrlKey)) {
            if(this.mode === 'navigation' && this.grid.multiselectable === 'true') {
                event.preventDefault()
                this.grid.selectAll()
            }
        }
        else if([SPACE, ...DIGIT_CODES, ...LETTER_CODES].includes(keyCode)) {
            if(keyCode === SPACE && this.readonly && this.selected && !this.disabled) {
                event.preventDefault()
                this.grid.unselect()
                this.selected = 'true'
                this.emit('click')
            }
            if(!event.metaKey && !event.ctrlKey) this.mode = 'edit'
        }
    }
    onBackspaceKeyDown(event) {
        if(!this.readonly && this.mode === 'navigation') {
            event.preventDefault()
            const selected = this.grid.selected
            if(selected.length) selected.forEach(cell => cell.value = '')
            else this.value = ''
        }
    }
    onEnterKeyDown({ ctrlKey, metaKey }) {
        if(this.mode === 'navigation') {
            const grid = this.grid
            if(ctrlKey || metaKey) {
                const selected = grid.selected
                if(selected.length) {
                    const merged = selected.filter(cell => Boolean(cell.merged.length))
                    grid.unselect()
                    if(merged.length) merged.forEach(cell => cell.unmerge())
                    else grid.merge(selected)
                } else this.unmerge()
            } else {
                grid.unselect()
                this.mode = 'edit'
            }
        } else {
            this.mode = 'navigation'
            this.element.focus()
        }
    }
    unmerge() {
        const merged = this.merged
        if(merged.length) {
            let cell
            while(cell = merged.pop()) {
                cell.span = null
                cell.hidden = false
            }
            const element = this.element
            element.rowSpan = 1
            element.colSpan = 1
        }
    }
    onEscapeKeyDown() {
        if(this.mode === 'edit') {
            this.mode = 'navigation'
            this.element.focus()
        }
        else this.grid.unselect()
    }
    onDoubleClick() {
        this.mode = 'edit'
    }
    onArrowKeyDown({ keyCode, ctrlKey, shiftKey, metaKey }) {
        const grid = this.grid
        const current = shiftKey && grid.selection || this
        let target
        if(ctrlKey || metaKey) {
            const rowCells = current.row.cells
            const column = current.column
            switch(keyCode) {
                case LEFT: target = rowCells[0]; break
                case UP: target = column[0]; break
                case RIGHT: target = rowCells[rowCells.length - 1]; break
                case DOWN: target = column[column.length - 1]; break
            }
        } else {
            switch(keyCode) {
                case LEFT: target = current.leftSibling; break
                case UP: target = current.topSibling; break
                case RIGHT: target = current.rightSibling; break
                case DOWN: target = current.bottomSibling; break
            }
        }
        if(target) {
            if(grid.multiselectable === 'true') {
                if(shiftKey) grid.updateSelection(target)
                else {
                    grid.unselect()
                    target.focus()
                }
            } else target.focus()
        }
    }
}

export function gridcell(init) {
    return new GridCell('td', NodeInit(init))
}
