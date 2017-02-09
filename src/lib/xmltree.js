import { group, tree, treeItem } from 'ariamodule'
import { nodeGrid } from './nodegrid'
import { xmlFetch } from './xmlfetch'

const map = Array.prototype.map

export function domTreeItem(node) {
    return treeItem({
        expanded : node.children.length? 'true' : undefined,
        children : [
            nodeGrid({ targetNode : node }),
            node.children.length?
                group(map.call(node.children, child => domTreeItem(child))) :
                null
        ]
    })
}

export function domTree(url, init) {
    xmlFetch(url)
        .then(doc => {
            tree(init).children = domTreeItem(doc.documentElement)
        })
}
