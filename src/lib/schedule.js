import { DocumentAssembler, ElementAssembler } from 'dommodule'

const serializer = new XMLSerializer

export class Schedule extends DocumentAssembler {
    toString() {
        return serializer.serializeToString(this.node)
    }
    get root() {
        return this.node.documentElement
    }
    set reservation(reservation) {
        const { time, detail, value } = reservation
        const node = this.node.querySelector(`[time="${ time }"][detail="${ detail }"`)
        if(value) {
            if(node) node.replaceWith(reservation)
            this.root.append(reservation.node)
        }
        else if(node) node.remove()
    }
}

export function schedule(init) {
    return new Schedule('schedule', init)
}

export class Reservation extends ElementAssembler {
    set time(time) {
        this.node.setAttribute('time', time)
    }
    get time() {
        return this.node.getAttribute('time')
    }
    set duration(duration) {
        this.node.setAttribute('duration', duration)
    }
    get duration() {
        return this.node.getAttribute('duration')
    }
    set detail(detail) {
        this.node.setAttribute('detail', detail)
    }
    get detail() {
        return this.node.getAttribute('detail')
    }
    set value(value) {
        this.node.textContent = value
    }
    get value() {
        return this.node.textContent
    }
    /*set schedule(schedule) {
        this.parentNode = schedule.node
    }*/
}

export function reservation(init) {
    return new Reservation('reservation', init)
}
