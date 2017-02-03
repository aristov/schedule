import moment from 'moment'
import { Grid, rowGroup, rowHeader, row, columnHeader } from 'ariamodule'
import { timeRow } from './timerow'
import { timeCell } from './timecell'
import { schedule } from './schedule'

import { Reserve } from './reserve'
import { timeSheet } from './timesheet'

const DATE_FORMAT = 'YYYY-MM-DD'
const DEFAULT_TIME = '00:00'

const { forEach } = Array.prototype

export class TimeGrid extends Grid {

    init(init) {
        if(init) {
            const date = init.date
            delete init.date
            super.init(init)
            this.date = date || moment().format(DATE_FORMAT)
        }
        this.multiselectable = true
        this.node.onkeydown = this.onKeyDown.bind(this)
        this.busy = true
        schedule().then(schedule => {
            this.schedule = schedule
            forEach.call(schedule.documentElement.children, node => {
                this.data = new Reserve(node)
            })
            this.busy = false
        })
    }

    onKeyDown(event) {
        if(event.key.startsWith('Arrow')) this.onArrowKeyDown(event)
    }

    onArrowKeyDown(event) {
        const { key, target, metaKey } = event
        if(target === this.gridHeader.node ||
            (metaKey && target.tagName === 'TD')) {
                const date = moment(this.date)
                switch(key) {
                    case 'ArrowUp': date.subtract(1, 'w'); break
                    case 'ArrowDown': date.add(1, 'w'); break
                    case 'ArrowLeft': date.subtract(1, 'd'); break
                    case 'ArrowRight': date.add(1, 'd'); break
                }
                this.date = date.format(DATE_FORMAT)
                this.busy = true
                forEach.call(this.schedule.documentElement.children, node => {
                    this.data = node.assembler || new Reserve(node)
                })
                this.busy = false
                if(metaKey) this.body.cells[0].focus()
                event.preventDefault()
            }
    }

    get body() {
        return this.bodies.filter(({ hidden }) => !hidden)[0]
    }

    set data(data) {
        this.bodies.forEach(body => body.data = data)
    }

    set columns(columns) {
        columns = columns.split(' ')
        this.children = rowGroup({
            tagName : 'thead',
            children : row([
                rowHeader({
                    tabIndex : 0,
                    className : 'gridheader',
                    children : moment().format('DD/MM'),
                }),
                columns.map(children => columnHeader({
                    style : { width : 95 / columns.length + '%' },
                    dataset: { detail : children },
                    children,
                }))
            ])
        })
    }

    set date(date) {
        const selector = `tbody[data-date="${ date }"]`
        const body = this.node.querySelector(selector)
        const bodies = this.bodies
        if(body) {
            bodies.forEach(node => node.hidden = node.node !== body)
        }
        else {
            const bodygroup = timeSheet({ dataset : { date } })
            const columns = this.rows[0].cells.slice(1)
            const time = moment([date, this.time].join('T'))
            const day = time.day()
            do {
                bodygroup.children = timeRow({
                    time : time.format('x'),
                    children : [
                        rowHeader(time.format('HH:mm')),
                        columns.map(() => timeCell({ selected : false }))
                    ]
                })
                time.add(30, 'm')
            }
            while(time.day() === day)
            bodies.forEach(body => body.hidden = true)
            this.children = bodygroup
        }
        this.gridHeader.textContent = moment(date).format('DD/MM/YY')
        this.dataset = { date }
    }

    get gridHeader() {
        return this.cells[0]
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

Object.defineProperty(TimeGrid.prototype, 'schedule', { writable : true, value : null })

export function timeGrid(init) {
    return new TimeGrid('table', init)
}
