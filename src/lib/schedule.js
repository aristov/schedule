import { DocumentAssembler, element } from 'dommodule'

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
        const assembler = this.documentElement.assembler
        if(assembler) return assembler
        else return element(this.documentElement, {})
    }
    set reserve(reserve) {
        this.element.children = reserve.node
        this.fetch()
    }
    get reserves() {
        return this.element.children
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
