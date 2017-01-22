import { timerow } from './timerow'
import { Grid, GridCell, rowgroup, rowheader, row, columnheader } from 'ariamodule'
import moment from 'moment'

const DATE_FORMAT = 'YYYY-MM-DD'

const date = moment().format(DATE_FORMAT)

export class TimeCell extends GridCell {}

export function timecell(init) {
    return new TimeCell('td', init)
}

export class TimeTable extends Grid {

    init(init) {
        const columns = init.columns.split(' ')
        const headgroup = rowgroup({
            tagName : 'thead',
            children : row([
                columnheader({
                    tabIndex : 0,
                    children : moment(date, DATE_FORMAT).format('DD/MM')
                }),
                columns.map(children => columnheader({
                    style : { width : 95 / columns.length + '%' },
                    children,
                }))
            ])
        })
        const bodygroup = rowgroup()
        const time = moment(init.time || '09:00', 'hh:mm')
        const day = time.day()
        while(time.day() === day) {
            bodygroup.children = timerow({
                time,
                children : [
                    rowheader(time.format('HH:mm')),
                    columns.map(() => timecell({ selected : false }))
                ]
            })
            time.add(30, 'm')
        }
        init.children = [headgroup, bodygroup]
        delete init.columns
        super.init(init)
    }

    set date(date) {
        this.dataset = { date }
    }

    get date() {
        return this.dataset.date || moment().format(DATE_FORMAT)
    }
}

export function timetable({
    date = moment().format(DATE_FORMAT)
} = {}) {
    return new TimeTable('table', {
        date,
        multiselectable : true,
        time : '09:00',
        columns : 'Neo Fa Forte Sol Piano'
    })
}
