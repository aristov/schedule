import { Row } from 'ariamodule'
import moment from 'moment'

const UPDATE_INTERVAL_MS = 30 * 1000

export class TimeRow extends Row {
    constructor(object, init) {
        super(object, init)
        this.node.classList.add('timerow')
        this.sync()
    }

    sync() {
        const now = moment()
        const start = moment(this.time)
        const end = start.add(30, 'm')
        this.current = now.isBetween(start, end)? 'time' : 'false'
        setTimeout(() => this.sync(), UPDATE_INTERVAL_MS)
    }

    set reservation(reservation) {
        const selector = `th[data-detail=${ reservation.detail }]`
        const node = this.grid.node.querySelector(selector)
        if(node) {
            const cell = this.cells[node.cellIndex]
            if(cell) cell.reservation = reservation
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
