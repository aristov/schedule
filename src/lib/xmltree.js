import { Tree, group, treeItem } from 'ariamodule'
import { nodeGrid } from './nodegrid'
import { xmlFetch } from './xmlfetch'

const map = Array.prototype.map

export function domTreeItem(node) {
    return treeItem({
        expanded : node.children.length? 'true' : undefined,
        tabIndex : 0,
        children : [
            nodeGrid({ targetNode : node }),
            node.children.length?
                group(map.call(node.children, child => domTreeItem(child))) :
                null
        ]
    })
}

export class DOMTree extends Tree {
    set src(src) {
        xmlFetch(src).then(doc => {
            this.children = domTreeItem(doc.documentElement)
        })
    }
}

export function domTree(init) {
    return new DOMTree('div', init)
}
