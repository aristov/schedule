import { DocumentAssembler } from 'dommodule'

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
    get element() {
        return this.node.documentElement // fixme
    }
    set reserve(reserve) {
        this.element.append(reserve.node)
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
