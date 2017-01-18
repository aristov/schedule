import { thead, tbody, tr, th, htmldom } from 'htmlmodule'
import { Grid, GridCell, row, gridcell } from './lib/grid'
import { xmldom } from './lib/xmlassembler'

const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
const MINUTES = ['00', '30']
const ROOMS = [
    'Neo hall',
    'Do forte',
    'Do piano',
    'Sol studio',
    'Fa studio'
]

const forEach = Array.prototype.forEach

export function time(init) {
    return htmldom('time', init)
}

export class Schedule extends Grid {
    constructor(object, init) {
        super(object)
        this.loading = false
        this.datenow = new Date
        this.init({
            multiselectable : true,
            onchange : () => {
                // this.saveJSON()
                this.saveXML()
            },
            children : [this.head, this.body]
        })
        this.init(init)
    }

    get head() {
        const datenow = this.datenow
        return thead(tr([
            th([
                datenow.getDate(),
                datenow.getMonth() + 1
            ].join('/')),
            ...this.rooms.map(room => th(room))
        ]))
    }

    get body() {
        const datenow = this.datenow
        return tbody(HOURS.map(hour =>
            MINUTES.map(minute => {
                const hournow = datenow.getHours() === hour
                const minutesnow = datenow.getMinutes()
                const minutenow = minutesnow > minute && minutesnow <= minute + 30
                return row({
                    aria : { current : hournow && minutenow? 'time' : undefined },
                    children : [
                        th(time(hour + ':' + minute)),
                        ...this.rooms.map(() => gridcell())
                    ]
                })
            })))
    }

    get rooms() {
        return ROOMS
    }

    get timerows() {
        const rows = {}
        HOURS.forEach((hour, i) =>
            MINUTES.forEach((minute, j) => {
                rows[[hour, minute].join(':')] = 2 * i + j
            }))
        return rows
    }

    saveJSON() {
        if(!this.loading) {
            const datacells = this.findAll(GridCell, ({ value }) => Boolean(value))
            const data = datacells.map(({ value, row, node, index }) => {
                return {
                    value,
                    time : row.node.querySelector('time').innerHTML,
                    duration : node.rowSpan * 30,
                    room : this.rooms[index]
                }
            })
            localStorage.setItem('data', JSON.stringify(data))
        }
    }

    loadJSON(data) {
        this.loading = true
        JSON.parse(data).forEach(session => {
            const rowIndex = this.timerows[session.time]
            const colIndex = this.rooms.indexOf(session.room)
            const cell = this.rows[rowIndex].cells[colIndex]
            cell.value = session.value
            cell.rowSpan = session.duration / 30 - 1
            cell.tabIndex = 0
        })
        this.loading = false
    }

    saveXML() {
        if(!this.loading) {
            const datacells = this.findAll(GridCell, ({ value }) => Boolean(value))
            const xml = xmldom('schedule',
                datacells.map(({ value, row, node, index }) => {
                    return xmldom('session', {
                        attributes : {
                            time : row.node.querySelector('time').innerHTML,
                            duration : String(node.rowSpan * 30),
                            room : this.rooms[index],
                        },
                        children : value
                    })
                }))

            const serializer = new XMLSerializer
            fetch('.', {
                method : 'post',
                body : serializer.serializeToString(xml)
            })
                .then(res => res.text())
                .then(res => console.log('Saved', res))
        }
    }

    loadXML() {
        const parser = new DOMParser
        this.loading = true
        fetch('data/schedule.xml')
            .then(res => res.text())
            .then(res => {
                const doc = parser.parseFromString(res, 'application/xml')
                if(doc) {
                    forEach.call(doc.documentElement.children,
                        session => {
                            this.addSession(session)
                        })
                }
                this.loading = false
            })
    }

    addSession(session) {
        const rowIndex = this.timerows[session.getAttribute('time')]
        const colIndex = this.rooms.indexOf(session.getAttribute('room'))
        const cell = this.rows[rowIndex].cells[colIndex]
        cell.value = session.textContent
        cell.rowSpan = session.getAttribute('duration') / 30 - 1
        cell.tabIndex = 0
    }
}

export function schedule(init) {
    const instance = new Schedule('table', init)
    /*const data = localStorage.getItem('data')
    if(data) instance.loadJSON(data)*/
    instance.loadXML()
    return instance
}
