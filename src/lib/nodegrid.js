import { Grid, gridCell, columnHeader, row, rowGroup, rowHeader } from 'ariamodule'

const { map } = Array.prototype

export class NodeGrid extends Grid {
    set targetNode(targetNode) {
        const { childNodes, firstChild } = targetNode
        const isSimple = childNodes.length === 1 && firstChild.nodeType === Node.TEXT_NODE
        this.children = rowGroup([
            row([
                rowHeader({ rowSpan : 2, children : targetNode.tagName }),
                map.call(targetNode.attributes, attr => columnHeader(attr.name)),
                isSimple? columnHeader('textContent') : null
            ]),
            row([
                map.call(targetNode.attributes, attr => gridCell({ value : attr.value })),
                isSimple? gridCell({
                    value : targetNode.textContent,
                    style : { fontWeight: 'bold' }
                }) : null
            ])
        ])
    }
}

export function nodeGrid(init) {
    return new NodeGrid('table', init)
}
