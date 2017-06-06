/*
import { domTree } from './lib/xmltree'
import { xmlFetch } from './lib/xmlfetch'

const src = location.hash.slice(1) || '/data/schedule.xml'

xmlFetch(src).then(node => domTree({
    targetNode : node,
    parentNode : document.body
}))

tree({
    parentNode : document.body,
    children : domTree(document.documentElement)
})

import { NodeGrid } from './lib/nodegrid'

Array.prototype.forEach.call(
    document.head.children,
    targetNode => {
        new NodeGrid('table', { targetNode, parentNode : document.body })
    })

*/

import { domtree } from  './lib/domtree'

const parser = new DOMParser

fetch('data/schedule.xml')
    .then(res => res.text())
    .then(xml => {
        const doc = parser.parseFromString(xml, 'text/xml')
        domtree(doc)
    })

