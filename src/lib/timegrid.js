import moment from 'moment'
import { Grid, rowgroup, rowheader, row, columnheader } from 'ariamodule'
import { timerow } from './timerow'
import { timecell } from './timecell'
import { schedule, reservation } from './schedule'

const DATE_FORMAT = 'YYYY-MM-DD'
const DEFAULT_TIME = '00:00'

const { map } = Array.prototype

const doc = schedule()

export class TimeGrid extends Grid {

    init(init) {
        super.init({ multiselectable : true })
        if(init) {
            const date = init.date
            delete init.date
            super.init(init)
            this.date = date || moment().format(DATE_FORMAT)
        }
        this.node.onchange = ({ target }) => {
            if(target.tagName === 'TD') {
                const cell = target.assembler
                doc.reservation = reservation({
                    time : cell.row.time.format(),
                    duration : cell.duration,
                    detail : cell.columnheader.node.textContent,
                    children : cell.value,
                })
                fetch('.', { method : 'post', body : doc.toString() })
                    .then(res => res.text())
                    .then(text => console.log(text))
            }
        }
    }

    save(event) {

    }

    set columns(columns) {
        columns = columns.split(' ')
        this.children = rowgroup({
            tagName : 'thead',
            children : row([
                columnheader({
                    tabIndex : 0,
                    onkeydown : event => {
                        const { key } = event
                        if(key.startsWith('Arrow')) {
                            const date = moment(this.date)
                            switch(key) {
                                case 'ArrowUp': date.add(1, 'd'); break
                                case 'ArrowDown': date.subtract(1, 'd'); break
                                case 'ArrowLeft': date.subtract(1, 'M'); break
                                case 'ArrowRight': date.add(1, 'M'); break
                            }
                            this.date = date.format(DATE_FORMAT)
                            event.preventDefault()
                        }
                    },
                    children : moment().format('DD/MM')
                }),
                columns.map(children => columnheader({
                    style : { width : 95 / columns.length + '%' },
                    children,
                }))
            ])
        })
    }

    get bodies() {
        return map.call(this.node.tBodies, ({ assembler }) => assembler)
    }

    set date(date) {
        const selector = `tbody[data-date="${ date }"]`
        const node = this.node.querySelector(selector)
        if(node) {
            this.bodies.forEach(body => body.hidden = body.node !== node)
        }
        else {
            const columns = this.rows[0].cells.slice(1)
            const bodygroup = rowgroup({ dataset : { date } })
            const time = moment([date, this.time].join('T'))
            const day = time.day()
            while(time.day() === day) {
                bodygroup.children = timerow({ time, children : [
                    rowheader(time.format('HH:mm')),
                    columns.map(() => timecell({ selected : false }))
                ] })
                time.add(30, 'm')
            }
            this.bodies.forEach(body => body.hidden = true)
            this.children = bodygroup
        }
        this.rows[0].cells[0].node.textContent = moment(date).format('DD/MM/YY')
        this.dataset = { date }
    }

    get date() {
        return this.dataset.date || moment().format(DATE_FORMAT)
    }

    set time(time) {
        this.dataset = { time }
    }

    get time() {
        return this.dataset.time || DEFAULT_TIME
    }
}

export function timegrid(init) {
    return new TimeGrid('table', init)
}
