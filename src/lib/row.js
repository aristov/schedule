import { NodeInit } from 'htmlmodule/lib/nodeinit'
import { Instance } from './Instance'
import { Grid } from './grid'
import { GridCell } from './gridcell'

export class Row extends Instance {
    constructor(object, init) {
        super(object, {
            role : 'row',
            className : 'row'
        })
        if(init) this.init(init)
    }
    set multiselectable(multiselectable) {
        this.element.setAttribute('aria-multiselectable', multiselectable)
    }
    get multiselectable() {
        return this.element.getAttribute('aria-multiselectable') === 'true'
    }
    /*set selected(selected) {
        this.cells.forEach(cell => cell.selected = selected)
    }
    get selected() {
        Boolean(this.cells.every(cell => cell.selected === 'true'))
    }*/
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
