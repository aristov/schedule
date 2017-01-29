import { GridCell } from 'ariamodule'
import { reservation } from './schedule'

export class TimeCell extends GridCell {

    init(init) {
        super.init({ onchange : this.onChange.bind(this) })
        super.init(init)
        this.reserve = null
    }

    onChange({ target }) {
        if(!this.grid.busy && target === this.node) {
            if(this.reserve) {
                if(this.value) {
                    ['time', 'duration', 'detail', 'value']
                        .forEach(prop => this.reserve[prop] = this[prop])
                }
                else {
                    this.reserve.remove()
                    this.reserve = null
                }
            } else {
                if(this.value) {
                    const { time, duration, detail, value } = this
                    this.reserve = reservation({ time, duration, detail, value })
                    if(this.schedule) this.schedule.reservation = this.reserve
                }
            }
        }
    }

    get schedule() {
        return this.grid.schedule
    }

    set reservation(reservation) {
        this.value = reservation.textContent
        this.duration = reservation.duration
        this.reserve = reservation
    }

    get time() {
        return this.row.time
    }

    set duration(duration) {
        this.rowSpan = duration / 30
    }

    get duration() {
        return this.rowSpan * 30
    }

    get detail() {
        return this.columnHeader.textContent
    }
}

export function timecell(init) {
    return new TimeCell('td', init)
}
