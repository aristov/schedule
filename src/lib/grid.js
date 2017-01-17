import { NodeInit } from 'htmlmodule/lib/nodeinit'
import { Instance } from './Instance'
import { GridCell, gridcell } from './gridcell'
import { Row, row } from './row'

export { row, gridcell, Row, GridCell }

export class Grid extends Instance {
    constructor(element, init) {
        super(element, {
            role : 'grid',
            className : 'grid',
            mode : 'navigation'
        })
        if(init) this.init(init)
        this.selection = null
        this.activeCell = this.cells[0]
    }
    get rows() {
        return this.findAll(Row)
    }
    get cells() {
        return this.findAll(GridCell)
    }
    set multiselectable(multiselectable) {
        this.element.setAttribute('aria-multiselectable', multiselectable)
    }
    get multiselectable() {
        return this.element.getAttribute('aria-multiselectable') === 'true'
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
    get activeCell() {
        return this.find(GridCell, ({ active }) => active)
    }
    set activeCell(cell) {
        const active = this.activeCell
        if(active) active.active = false
        cell.active = true
    }
    unselect() {
        this.selected.forEach(cell => cell.selected = 'false')
        this.selection = null
    }
    merge(cells) {
        const first = cells[0]
        const last = cells[cells.length - 1]
        let value = first.value
        cells.forEach(cell => {
            cell.selected = 'false'
            if(cell !== first) {
                first.merged.push(cell)
                cell.span = first
                if(cell.value && cell.value !== value) {
                    value += ' + ' + cell.value
                }
                cell.value = ''
                cell.hidden = true
            }
        })
        first.element.colSpan = last.index - first.index + 1
        first.element.rowSpan = last.row.index - first.row.index + 1
        first.value = value
        if(first.value) first.emit('change')
    }
    selectAll() {
        const rows = this.rows
        const firstRowCells = rows[0].cells
        const lastRowCells = rows[rows.length - 1].cells
        const topLeftCell = firstRowCells[0]
        const topRightCell = firstRowCells[firstRowCells.length - 1]
        const bottomLeftCell = lastRowCells[0]
        const bottomRightCell = lastRowCells[lastRowCells.length - 1]
        const activeCell = this.activeCell
        let selection
        this.cells.forEach(cell => cell.selected = 'true')
        switch(activeCell) {
            case topLeftCell : selection = bottomRightCell; break
            case topRightCell : selection = bottomLeftCell; break
            case bottomLeftCell : selection = topRightCell; break
            case bottomRightCell : selection = topLeftCell; break
            default : selection = activeCell
        }
        this.selection = selection
    }
    updateSelection(target) {
        const activeCell = this.activeCell
        this.unselect()
        if(activeCell && target !== activeCell) {
            const activeRow = activeCell.row
            const rowStart = Math.min(activeRow.index, target.row.index)
            const rowEnd = Math.max(activeRow.index, target.row.index)
            const colStart = activeRow.multiselectable?
                Math.min(activeCell.index, target.index) :
                activeCell.index
            const colEnd = activeRow.multiselectable?
                Math.max(activeCell.index, target.index) :
                activeCell.index
            const rows = this.rows
            let merged = false
            for(let i = rowStart; i <= rowEnd; i++) {
                let cells = rows[i].cells
                for(let j = colStart; j <= colEnd; j++) {
                    let cell = cells[j]
                    // if(cell.span || cell.merged.length) { merged = true; break } else
                    cell.selected = 'true'
                }
                if(merged) break
            }
            if(!merged) this.selection = target
        }
    }
}

export function grid(init) {
    return new Grid('table', NodeInit(init))
}
