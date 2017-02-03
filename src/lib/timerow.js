import { Row } from 'ariamodule'
import moment from 'moment'

const UPDATE_INTERVAL_MS = 30 * 1000

export class TimeRow extends Row {
    init(init) {
        super.init(init)
        this.sync()
    }

    sync() {
        const now = moment()
        const start = moment(this.time, 'x')
        const end = moment(this.time, 'x').add(30, 'm')
        this.current = now.isBetween(start, end)? 'time' : 'false'
        this.gridCells.forEach(cell => cell.update())
        setTimeout(() => this.sync(), UPDATE_INTERVAL_MS)
    }

    set data(data) {
        if(data.time === this.time) {
            this.gridCells.forEach(cell => cell.data = data)
        }
    }

    get gridCells() {
        return this.cells.filter(({ node }) => node.tagName === 'TD' )
    }

    set time(time) {
        this.dataset = { time }
    }

    get time() {
        return this.dataset.time
    }
}

export function timeRow(init) {
    return new TimeRow('tr', init)
}
