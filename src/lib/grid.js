import { NodeInit } from 'htmlmodule/lib/nodeinit'
import { ARIADOMAssembler } from './ariaassembler'

export class Grid extends ARIADOMAssembler {
    constructor(object, init) {
        super(object, init)
        this.init({
            role : 'grid',
            className : 'grid',
        })
    }
    set label(label) {
        this.node.setAttribute('aria-label', label)
    }
    get label() {
        this.node.getAttribute('aria-label')
    }
}

export function grid(init) {
    return new Grid('table', NodeInit(init))
}


export class Row extends ARIADOMAssembler {
    constructor(object, init) {
        super(object, init)
        this.init({
            role : 'row',
            className : 'row',
        })
    }
}

export function row(init) {
    return new Row('tr', NodeInit(init))
}


export class GridCell extends ARIADOMAssembler {
    constructor(object, init) {
        super(object, init)
        this.init({
            role : 'gridcell',
            className : 'gridcell',
            tabIndex : 'tabIndex' in init? init.tabIndex : -1,
        })
    }
}

export function gridcell(init) {
    return new GridCell('td', NodeInit(init))
}
