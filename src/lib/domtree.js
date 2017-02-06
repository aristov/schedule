import { grid, row, rowGroup, columnHeader, gridCell } from 'ariamodule'
import { Schedule } from './schedule'
import moment from 'moment'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE

const handlers = {
    time : time => moment(time, 'x').format('dddd, DD MMM YYYY, HH:mm'),
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
    grid({
        parentNode : document.body,
        children : [
            rowGroup({
                tagName : 'thead',
                children : row(attrNames.map(name => columnHeader(name)))
            }),
            rowGroup(data.reserves.map(reserve =>
                row(attrNames.map(name => gridCell({
                    style : { width : '25%' }, // todo autowidth
                    value : handlers[name](reserve[name])
                })))))
        ]
    })
}
