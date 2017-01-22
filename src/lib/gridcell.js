import { span, input } from 'htmlmodule'
import { NodeInit } from 'htmlmodule/lib/nodeinit'
import { Instance } from './Instance'
import { Grid } from './grid'
import { Row } from './row'
import { ENTER, ESCAPE, SPACE, BACKSPACE, ARROWS, DIGITS, LETTERS } from './keyCodes'

const { LEFT, UP, RIGHT, DOWN } = ARROWS
const ARROW_CODES = Object.values(ARROWS)
const DIGIT_CODES = Object.values(DIGITS)
const LETTER_CODES = Object.values(LETTERS)

export class GridCell extends Instance {
    constructor(object, init) {
        super(object, {
            role : 'gridcell',
            className : 'gridcell',
            tabIndex : -1,
            children : [
                span({ className : 'text' }),
                input({ hidden : true })
            ]
        })
        this.init({
            onfocus : this.onFocus.bind(this),
            onblur : this.onBlur.bind(this),
            onclick : this.onClick.bind(this),
            ondblclick : this.onDoubleClick.bind(this),
            onkeydown : this.onKeyDown.bind(this),
            onmouseenter : this.onMouseEnter.bind(this),
        })
        if(init) this.init(init)
        this.span = null
    }
    get grid() {
        return this.closest(Grid)
    }
    get row() {
        return this.closest(Row)
    }
    get text() {
        return this.node.querySelector('.text')
    }
    get mode() {
        return this.element.dataset.mode || 'navigation'
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
        const _value = this.value
        this.input.value = this.text.textContent = value
        const { element } = this
        if(value) element.dataset.value = value
        else element.removeAttribute('data-value')
        if(_value !== value) this.emit('change')
    }
    get value() {
        return this.input.value
    }
    set active(active) {
        const { node } = this
        node.tabIndex = active? 0 : this.value? 0 : -1
        node.classList.toggle('active', active)
    }
    get active() {
        return this.node.classList.contains('active')
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
        return this.element.querySelector('input')
    }
    set rowSpan(rowSpan) {
        const cells = [this]
        let next = this
        while(rowSpan-- > 0 && next) {
            cells.push(next = next.bottomSibling)
        }
        this.grid.mergeCells(cells)
        // this.grid.mergeCells(this.column.slice(this.index + 1, rowSpan + 1))
    }
    get rowSpan() {
        return this.node.rowSpan
    }
    get colSpan() {
        return this.node.colSpan
    }
    set colSpan(colSpan) {
        console.log(this.row, colSpan)
    }
    onBlur() {
        this.mode = 'navigation'
    }
    onInputBlur() {
        this.mode = 'navigation'
    }
    onClick() {
        if(this.mode === 'navigation' && !this.disabled) {
            this.grid.unselectAll()
            this.selected = 'true'
        }
    }
    onFocus() {
        this.grid.activeCell = this
    }
    onMouseEnter({ buttons }) {
        const grid = this.grid
        if(buttons === 1 && grid.multiselectable) {
            grid.updateSelection(this)
        }
    }
    onKeyDown(event) {
        const keyCode = event.keyCode
        if(keyCode === ENTER) {
            this.onEnterKeyDown(event)
        }
        else if(keyCode === ESCAPE) {
            this.onEscapeKeyDown(event)
        }
        else if(ARROW_CODES.includes(keyCode) && this.mode === 'navigation') {
            event.preventDefault()
            this.onArrowKeyDown(event)
        }
        else if(keyCode === BACKSPACE) {
            this.onBackspaceKeyDown(event)
        }
        else if(keyCode === LETTERS.A && (event.metaKey || event.ctrlKey)) {
            this.onSelectAllKeyDown(event)
        }
        else if([SPACE, ...DIGIT_CODES, ...LETTER_CODES].includes(keyCode)) {
            this.onCharacterKeyDown(event)
        }
    }
    onCharacterKeyDown(event) {
        const { keyCode } = event
        if(keyCode === SPACE && this.readonly && this.selected && !this.disabled) {
            event.preventDefault()
            this.grid.unselectAll()
            this.selected = 'true'
            this.emit('click')
        }
        if(!event.metaKey && !event.ctrlKey) this.mode = 'edit'
    }
    onSelectAllKeyDown(event) {
        if(this.mode === 'navigation' && this.grid.multiselectable) {
            event.preventDefault()
            this.row.multiselectable?
                this.grid.selectAll() :
                this.column.forEach(cell => cell.selected = 'true')
        }
    }
    onBackspaceKeyDown(event) {
        if(!this.readonly && this.mode === 'navigation') {
            event.preventDefault()

            const selected = this.grid.selected
            if(selected.length) selected.forEach(cell => cell.value = '')
            else this.value = ''

            const activeCell = this.grid.activeCell
            activeCell.unmerge()
            activeCell.value = ''
        }
    }
    onEnterKeyDown({ metaKey }) {
        if(this.mode === 'navigation') {
            const grid = this.grid
            const selected = grid.selected
            const cells = []
            if(selected.length) {
                grid.unselectAll()
                selected.forEach(cell => {
                    cells.push(cell)
                    if(cell.merged.length) {
                        cell.merged.forEach(mergedCell => {
                            cells.push(mergedCell)
                        })
                        cell.unmerge()
                    }
                })
                grid.mergeCells(cells)
                grid.activeCell = cells[0]
                grid.activeCell.focus()
                grid.activeCell.mode = 'edit'
            }
            else if(this.value) {
                if(metaKey) this.unmerge()
            }
            else if(this.merged.length) this.unmerge()
            this.mode = 'edit'
        } else {
            this.mode = 'navigation'
            this.element.focus()
        }
    }
    onEscapeKeyDown() {
        if(this.mode === 'edit') {
            this.mode = 'navigation'
            this.element.focus()
        }
        else this.grid.unselectAll()
    }
    onDoubleClick() {
        this.mode = 'edit'
    }
    onArrowKeyDown({ keyCode, ctrlKey, shiftKey, metaKey, altKey }) {
        const grid = this.grid
        const current = shiftKey && grid.selection || this
        let target
        if(ctrlKey || metaKey) {
            const rowCells = current.row.cells
            const column = current.column
            switch(keyCode) {
                case UP: target = column[0]; break
                case DOWN: target = column[column.length - 1]; break
                case LEFT: target = rowCells[0]; break
                case RIGHT: target = rowCells[rowCells.length - 1]; break
            }
        } else if(altKey) {
            switch(keyCode) {
                case UP: this.replaceWith(this.topSibling); break
                case DOWN: this.replaceWith(this.bottomSibling); break
                case LEFT: this.replaceWith(this.leftSibling); break
                case RIGHT: this.replaceWith(this.rightSibling); break
            }
        } else {
            switch(keyCode) {
                case UP: target = current.topSibling; break
                case DOWN: target = current.bottomSibling; break
                case LEFT: target = current.leftSibling; break
                case RIGHT: target = current.rightSibling; break
            }
        }
        if(target) {
            if(grid.multiselectable) {
                if(shiftKey) {
                    grid.updateSelection(target)
                }
                else {
                    grid.unselectAll()
                    target.focus()
                }
            } else target.focus()
        }
    }
    replaceWith(cell) {
        if(this.value && cell) {
            if(this.merged) this.unmerge()
            if(cell.merged) cell.unmerge()
            const rows = this.grid.rows
            const index1 = this.row.index
            const index2 = cell.row.index
            const row1 = rows[index1].node
            const row2 = rows[index2].node
            const ref1 = this.node.nextSibling
            const ref2 = cell.node.nextSibling
            row1.insertBefore(cell.node, ref1)
            row2.insertBefore(this.node, ref2)
            this.focus()
            this.emit('change')
        }
    }
    focus() {
        this.span? this.span.focus() : this.node.focus()
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
            if(this.value) this.emit('change')
        }
    }
}

export function gridcell(init) {
    return new GridCell('td', NodeInit(init))
}
