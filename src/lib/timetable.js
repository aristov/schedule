import { timerow } from './timerow'
import { Grid, GridCell, ColumnHeader,
    rowgroup, rowheader, row, columnheader } from 'ariamodule'
import moment from 'moment'

const DATE_FORMAT = 'YYYY-MM-DD'

const cells = 'Neo Sol Fa Forte Piano'.split(' ')
const date = moment().format(DATE_FORMAT)

export class TimeCell extends GridCell {}

export function timecell(init) {
    return new TimeCell('td', init)
}

export class TimeTable extends Grid {

    constructor(object, init) {
        super(object)
        this.children = [this.headGroup, this.bodyGroup]
        if(init) this.init(init)
    }

    set date(date) {
        this.dataset = { date }
    }

    get date() {
        return this.dataset.date || moment().format(DATE_FORMAT)
    }

    get headGroup() {
        return rowgroup({
            tagName : 'thead',
            children : row([
                columnheader({
                    tabIndex : 0,
                    children : moment(date, DATE_FORMAT).format('DD/MM')
                }),
                cells.map(children => columnheader({
                    style : { width : 95 / cells.length + '%' },
                    children,
                }))
            ])
        })
    }

    get bodyGroup() {
        const bodygroup = rowgroup()
        const time = moment(date, DATE_FORMAT).hour(9)
        while(time.hour()) {
            bodygroup.children = timerow({
                time : time,
                children : [
                    rowheader(time.format('HH:mm')),
                    cells.map(() => timecell({ selected : false }))
                ]
            })
            time.add(30, 'm')
        }
        return bodygroup
    }
}

export class DaySwitcher extends ColumnHeader {

}

export function timetable({
    date = moment().format(DATE_FORMAT)
} = {}) {
    return new TimeTable('table', {
        date,
        multiselectable : true,
        start : '09:00',
        columns : 'Neo Fa Sol Forte Piano'
    })
}
