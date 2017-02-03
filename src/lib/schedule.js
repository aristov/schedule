import { DocumentAssembler, element } from 'dommodule'
import { Reserve } from './reserve'

const parser = new DOMParser
const serializer = new XMLSerializer

export class Schedule extends DocumentAssembler {
    constructor(...args) {
        super(...args)
        this.node.assembler = this
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
    set reserves(reserves) {
        reserves.forEach(reserve => this.reserve = reserve)
    }
    get reserves() {
        return this.element.children.map(node => {
            return node.assembler || new Reserve(node)
        })
    }
    fetch() {
        return fetch('.', { method : 'post', body : this.toString() })
            .then(res => res.text())
            .then(text => {
                console.log(text) // don't kill me!
            })
    }
    toString() {
        return serializer.serializeToString(this.node)
    }
}

/**
 * @returns {Promise}
 */
export function schedule() {
    return fetch('data/schedule.xml')
        .then(res => res.text())
        .then(xml => {
            const doc = parser.parseFromString(xml, 'text/xml')
            return new Schedule(doc)
        })
}
