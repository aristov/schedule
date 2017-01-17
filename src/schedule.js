import { thead, tbody, tr, th, htmldom } from 'htmlmodule'
import { grid, row, gridcell, GridCell, Row } from './lib/grid'

const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
const minutes = ['00', '30']

const rows = {}
hours.forEach((hour, i) =>
    minutes.forEach((minute, j) => {
        rows[[hour, minute].join(':')] = 2 * i + j
    }))

export function time(init) {
    return htmldom('time', init)
}

export class TimeRow extends Row {
    get time() {
        return this.node.querySelector('time')
    }
}

const rooms = [
    'Neo hall',
    'Do forte',
    'Do piano',
    'Sol studio',
    'Fa studio'
]

export function schedule() {
    const datenow = new Date
    const schedulegrid = grid({
        multiselectable : 'true',
        children : [
            thead(tr([
                th(datenow.getDate() + '/' + datenow.getMonth() + 1),
                ...rooms.map(room => th(room))
            ])),
            tbody(hours.map((hour, h) =>
                minutes.map((minute, m) => row([
                    th(time(hour + ':' + minute)),
                    gridcell(),
                    gridcell(),
                    gridcell(),
                    gridcell(),
                    gridcell(),
                ]))))
        ]
    })
    JSON.parse(localStorage.getItem('data')).forEach(timesession => {
        const rowIndex = rows[timesession.time]
        const colIndex = rooms.indexOf(timesession.room)
        const cell = schedulegrid.rows[rowIndex].cells[colIndex]
        cell.value = timesession.value
        cell.rowSpan = timesession.duration / 30 - 1
        cell.tabIndex = 0
    })
    schedulegrid.init({
        onchange : (event) => {
            console.log(event)
            const filter = ({ value }) => Boolean(value)
            const datacells = schedulegrid.findAll(GridCell, filter)
            const data = datacells.map(({ value, row, node, index }) => {
                return {
                    value,
                    time : row.node.querySelector('time').innerHTML,
                    duration : node.rowSpan * 30,
                    room : rooms[index]
                }
            })
            localStorage.setItem('data', JSON.stringify(data))
        }
    })
    return schedulegrid
}
