import { GridCell } from 'ariamodule'
import { reserve } from './reserve'

const SECOND = 1000
const MINUTE = 60 * SECOND

export class TimeCell extends GridCell {

    init(init) {
        super.init(init)
        this.node.onchange = this.onChange.bind(this)
        this.reserve = null
    }

    update() {
        if(this.value) {
            const start = this.time
            const end = start + this.duration * MINUTE
            const now = Date.now()
            this.current = start < now && now < end? 'time' : 'false'
            this.node.classList.toggle('past', end < now)
        }
        else {
            this.current = 'false'
            this.node.classList.remove('past')
        }
    }

    onChange({ target }) {
        if(!this.busy && target === this.node) {
            if(this.reserve) {
                if(this.value) {
                    ['time', 'duration', 'detail', 'value']
                        .forEach(prop => this.reserve[prop] = this[prop])
                }
                else {
                    this.reserve.remove()
                    this.reserve = null
                }
                this.busy = true
            } else {
                if(this.value) {
                    const { time, duration, detail, value } = this
                    this.reserve = reserve({ time, duration, detail, value })
                    if(this.schedule) this.schedule.reserve = this.reserve
                }
            }
            this.update()
        }
    }

    set busy(busy) {
        /*if(busy !== this.busy) {
            if(busy) {
                this.schedule.fetch().then(res => this.busy = false)
            }
            else */super.busy = busy
        // }
    }

    get busy() {
        return this.grid.busy || super.busy
    }

    get schedule() {
        return this.grid.schedule
    }

    set data(data) {
        if(data.detail === this.detail) {
            this.duration = data.duration / MINUTE
            this.value = data.value
            this.status = data.status
            this.reserve = data
        }
    }

    get time() {
        return Number(this.row.time)
    }

    set duration(duration) {
        this.rowSpan = duration / 30
    }

    get duration() {
        return this.rowSpan * 30
    }

    get detail() {
        return this.columnHeader.textContent
    }

    set tabIndex(tabIndex) {
        super.tabIndex = this.value? 0 : tabIndex
    }

    get tabIndex() {
        return super.tabIndex
    }

    /**
     *
     * @param {String} value
     */
    set value(value) {
        super.value = value
        this.update()
    }

    /**
     *
     * @returns {String}
     */
    get value() {
        return super.value
    }

    set status(status) {
        if(status) this.dataset = { status }
        else this.node.removeAttribute('data-status')
        if(this.reserve) this.reserve.status = status
    }

    get status() {
        return this.dataset.status
    }

    set mode(mode) {
        if(mode !== this.mode) {
            const value = this.input.value
            super.mode = mode
            if(mode === 'navigation') {
                if(value.endsWith('+')) {
                    this.status = 'paid'
                    // this.text.textContent = value.slice(0, value.length - 1)
                } else {
                    this.status = ''
                }
            }
        }
    }

    get mode() {
        return super.mode
    }
}

export function timeCell(init) {
    return new TimeCell('td', init)
}
