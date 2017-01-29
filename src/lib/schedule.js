import { DocumentAssembler, ElementAssembler } from 'dommodule'

const parser = new DOMParser
const serializer = new XMLSerializer

export class Schedule extends DocumentAssembler {
    constructor(...args) {
        super(...args)
        this.node.assembler = this
    }
    toString() {
        return serializer.serializeToString(this.node)
    }
    get root() {
        return this.node.documentElement // fixme
    }
    set reserve(reserve) {
        this.root.append(reserve.node)
        this.fetch()
    }
    fetch() {
        return fetch('.', { method : 'post', body : this.toString() })
            .then(res => res.text())
            .then(text => {
                console.log(text) // don't kill me!
            })
    }
}

export function schedule(init) {
    return fetch('data/schedule.xml')
        .then(res => res.text())
        .then(xml => {
            const doc = parser.parseFromString(xml, 'text/xml')
            return new Schedule(doc, init)
        })
}

export class Reserve extends ElementAssembler {
    constructor(...args) {
        super(...args)
        this.node.assembler = this
    }
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
    get document() {
        const doc = this.node.ownerDocument
        return doc && doc.assembler
    }
    remove() {
        this.node.remove()
        this.document.busy = true
    }
}

export function reserve(init) {
    return new Reserve('reserve', init)
}
