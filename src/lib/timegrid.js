import moment from 'moment'
import { Grid, rowgroup, rowheader, row, columnheader } from 'ariamodule'
import { timerow } from './timerow'
import { timecell } from './timecell'
import { schedule, reservation, Reservation } from './schedule'

const DATE_FORMAT = 'YYYY-MM-DD'
const DEFAULT_TIME = '00:00'

const { forEach } = Array.prototype

const parser = new DOMParser

export class TimeGrid extends Grid {

    init(init) {
        if(init) {
            const date = init.date
            delete init.date
            super.init(init)
            this.date = date || moment().format(DATE_FORMAT)
        }
        super.init({
            multiselectable : true,
            busy : true,
        })
        schedule().then(schedule => {
            this.schedule = schedule
            forEach.call(schedule.root.children, node => {
                this.reservation = new Reservation(node)
            })
            this.busy = false
        })
    }

    onArrowKeyDown(event) {
        const { key } = event
        if(key.startsWith('Arrow')) {
            const date = moment(this.date)
            switch(key) {
                case 'ArrowUp':
                    date.add(1, 'd');
                    break
                case 'ArrowDown':
                    date.subtract(1, 'd');
                    break
                case 'ArrowLeft':
                    date.subtract(1, 'M');
                    break
                case 'ArrowRight':
                    date.add(1, 'M');
                    break
            }
            this.date = date.format(DATE_FORMAT)
            event.preventDefault()
        }
    }

    set reservation(reservation) {
        const selector = `tr[data-time="${ reservation.time }"]`
        const row = this.node.querySelector(selector)
        if(row) row.assembler.reservation = reservation
    }

    set columns(columns) {
        columns = columns.split(' ')
        this.children = rowgroup({
            tagName : 'thead',
            children : row([
                rowheader({
                    tabIndex : 0,
                    className : 'gridheader',
                    onkeydown : this.onArrowKeyDown.bind(this),
                    children : moment().format('DD/MM'),
                }),
                columns.map(children => columnheader({
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
            const bodygroup = rowgroup({ dataset : { date } })
            const columns = this.rows[0].cells.slice(1)
            const time = moment([date, this.time].join('T'))
            const day = time.day()
            do {
                bodygroup.children = timerow({
                    time : time.format('x'),
                    children : [
                        rowheader(time.format('HH:mm')),
                        columns.map(() => timecell({ selected : false }))
                    ]
                })
                time.add(30, 'm')
            } while(time.day() === day)
            bodies.forEach(body => body.hidden = true)
            this.children = bodygroup
        }
        this.gridHeader.textContent = moment(date).format('DD/MM/YY')
        this.dataset = { date }
    }

    get gridHeader() {
        return this.rows[0].cells[0]
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
