import { grid, row, rowHeader, rowGroup, columnHeader, gridCell } from 'ariamodule'
import { Schedule } from './schedule'
import moment from 'moment'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

const handlers = {
    time : time => moment(time, 'x').format('dddd, DD/MM/YYYY, HH:mm'),
    duration : duration => duration / HOUR + ' hours',
    value : value => value,
    detail : detail => detail
}

const attrNames = [
    'value',
    'time',
    'duration',
    'detail',
]

export function domtree(doc) {
    const data = new Schedule(doc)
    return grid([
        rowGroup({
            tagName : 'thead',
            children : row([
                rowHeader({ tabIndex : 0 }),
                attrNames.map(name => columnHeader(name))
            ])
        }),
        rowGroup(data.reserves.map((reserve, i) => row([
            rowHeader({ tabIndex : -1, children : String(++i) }),
            attrNames.map(name => gridCell({
                style : { width : '24%' }, // todo autowidth
                value : handlers[name](reserve[name])
            }))
        ])))
    ])
}
