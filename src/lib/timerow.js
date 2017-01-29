import { Row } from 'ariamodule'
import moment from 'moment'

const UPDATE_INTERVAL_MS = 30 * 1000

export class TimeRow extends Row {
    init(init) {
        super.init(init)
        this.node.classList.add('timerow')
        this.sync()
    }

    sync() {
        const now = moment()
        const start = moment(this.time, 'x')
        const end = moment(this.time, 'x').add(30, 'm')
        this.current = now.isBetween(start, end)? 'time' : 'false'
        setTimeout(() => this.sync(), UPDATE_INTERVAL_MS)
    }

    set data(data) {
        const selector = `th[data-detail=${ data.detail }]`
        const node = this.grid.node.querySelector(selector)
        if(node) {
            const cell = this.cells[node.cellIndex]
            if(cell) cell.data = data
        }
    }

    set time(time) {
        this.dataset = { time }
    }

    get time() {
        return this.dataset.time
    }
}

export function timerow(init) {
    return new TimeRow('tr', init)
}
