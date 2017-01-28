import { GridCell } from 'ariamodule'

export class TimeCell extends GridCell {

    set reservation(reservation) {
        this.value = reservation.textContent
        this.duration = reservation.duration
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
