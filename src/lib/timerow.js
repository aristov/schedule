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
        const start = this.time
        const end = this.time.add(30, 'm')
        this.current = now.isBetween(start, end)? 'time' : 'false'
        setTimeout(() => this.sync(), UPDATE_INTERVAL_MS)
    }

    set time(time) {
        this.dataset = { time : time.format('x') }
    }
    get time() {
        return moment(this.dataset.time, 'x')
    }
}

export function timerow(init) {
    return new TimeRow('tr', init)
}
