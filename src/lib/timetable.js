import { Grid, Row, gridcell, rowgroup, rowheader, row, columnheader } from 'ariamodule'
import moment from 'moment'

export class TimeTable extends Grid {

    set date(date) {
        this.dataset = { date }
    }

    get date() {
        return this.dataset.date || moment().format('YYYY-MM-DD')
    }
}

export class TimeRow extends Row {
    constructor(object, init) {
        super(object, init)
        this.sync()
    }

    sync() {
        const now = moment()
        const start = this.time
        const end = this.time.add(30, 'm')
        this.current = now.isBetween(start, end)? 'time' : 'false'
        setTimeout(() => this.sync(), 30 * 1000)
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

export function timetable(init) {
    const cells = 'Neo Sol Fa Forte Piano'.split(' ')

    const headgroup = rowgroup({
        tagName : 'thead',
        children : row([
            columnheader(moment().format('DD/MM')),
            cells.map(children => columnheader({
                style : { width : 95 / cells.length + '%' },
                children,
            }))
        ])
    })

    const bodygroup = rowgroup({})
    const time = moment(9, 'h')
    while(time.hour()) {
        bodygroup.children = timerow({
            time : time,
            children : [
                rowheader(time.format('HH:mm')),
                cells.map(() => gridcell({ selected : false }))
            ]
        })
        time.add(30, 'm')
    }

    return new TimeTable('table', {
        multiselectable : true,
        children : [headgroup, bodygroup]
    })
}
