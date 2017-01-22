import { timerow } from './timerow'
import { Grid, GridCell, rowgroup, rowheader, row, columnheader } from 'ariamodule'
import moment from 'moment'

const DATE_FORMAT = 'YYYY-MM-DD'
const DEFAULT_TIME = '09:00'

export class TimeCell extends GridCell {}

export function timecell(init) {
    return new TimeCell('td', init)
}

export class TimeTable extends Grid {

    init(init) {
        const columns = init.columns.split(' ')
        const { date = moment().format(DATE_FORMAT) } = init
        const start = moment([date, init.time || DEFAULT_TIME].join('T'))
        const headgroup = rowgroup({
            tagName : 'thead',
            children : row([
                columnheader({
                    tabIndex : 0,
                    children : start.format('DD/MM')
                }),
                columns.map(children => columnheader({
                    style : { width : 95 / columns.length + '%' },
                    children,
                }))
            ])
        })
        const bodygroup = rowgroup()
        const day = start.day()
        while(start.day() === day) {
            bodygroup.children = timerow({
                time : start,
                children : [
                    rowheader(start.format('HH:mm')),
                    columns.map(() => timecell({ selected : false }))
                ]
            })
            start.add(30, 'm')
        }
        delete init.columns
        super.init({
            multiselectable : true,
            children : [headgroup, bodygroup]
        })
        super.init(init)
    }

    set date(date) {
        this.dataset = { date }
    }

    get date() {
        return this.dataset.date || moment().format(DATE_FORMAT)
    }
}

export function timetable(init) {
    return new TimeTable('table', init)
}
