import { ElementAssembler } from 'dommodule'
import moment from 'moment'

export class Reserve extends ElementAssembler {
    constructor(...args) {
        super(...args)
        this.node.assembler = this
    }
    set time(time) {
        this.node.setAttribute('time', moment(time, 'x').format())
    }
    get time() {
        return moment(this.node.getAttribute('time')).format('x')
    }
    /*set time(time) {
        this.node.setAttribute('time', time)
    }
    get time() {
        return this.node.getAttribute('time')
    }*/
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
    get document() {
        const doc = this.node.ownerDocument
        return doc && doc.assembler
    }
    remove() {
        this.node.remove()
    }
}

export function reserve(init) {
    return new Reserve('reserve', init)
}
