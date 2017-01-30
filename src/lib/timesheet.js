import { RowGroup } from 'ariamodule'
import moment from 'moment'

export class TimeSheet extends RowGroup {
    set data(data) {
        if(moment(data.time, 'x').format('YYYY-MM-DD') === this.dataset.date) {
            this.rows.forEach(row => row.data = data)
        }
    }
    set children(children) {
        super.children = children
        if(!this.cells.some(c => c.tabIndex === 0)) {
            const first = this.cells[0]
            if(first) first.tabIndex = 0
        }
    }
    get cells() {
        const selector = 'td[role=gridcell]'
        const collection = this.node.querySelectorAll(selector)
        const handler = ({ assembler }) => assembler
        return Array.prototype.map.call(collection, handler)
    }
}

export function timeSheet(init) {
    return new TimeSheet('tbody', init)
}
