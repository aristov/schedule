import { group, tree, treeItem } from 'ariamodule'
import { nodeGrid } from './lib/nodegrid'
import { xmlFetch } from './lib/xmlfetch'

const map = Array.prototype.map

function domTree(node) {
    return treeItem({
        expanded : node.children.length? 'true' : undefined,
        children : [
            nodeGrid({ targetNode : node }),
            node.children.length?
                group(map.call(node.children, child => domTree(child))) :
                null
        ]
    })
}

xmlFetch('data/schedule.xml')
    .then(doc => tree({
        parentNode : document.body,
        children : domTree(doc.documentElement)
    }))

/*tree({
    parentNode : document.body,
    children : domTree(document.documentElement)
})*/

/*
import { NodeGrid } from './lib/nodegrid'

Array.prototype.forEach.call(
    document.head.children,
    targetNode => {
        new NodeGrid('table', { targetNode, parentNode : document.body })
    })
*/


/*
import { domtree } from  './lib/domtree'

const parser = new DOMParser

fetch('data/schedule.xml')
    .then(res => res.text())
    .then(xml => {
        const doc = parser.parseFromString(xml, 'text/xml')
        domtree(doc)
    })
*/

/*
import { scheduleApp } from './lib/scheduleapp'

const app = scheduleApp({
    columns : 'Neo Forte Piano Sol Fa',
    time : '09:00',
    date : '2017-01-31',
    // readOnly : true,
})

document.body = app.node
*/
