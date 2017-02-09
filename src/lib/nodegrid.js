import { Grid, gridCell, columnHeader, row, rowGroup, rowHeader } from 'ariamodule'

const { map } = Array.prototype

export class NodeGrid extends Grid {
    set targetNode(targetNode) {
        this.children = rowGroup([
            row({
                // tagName : 'thead',
                children : [
                    // columnHeader('tagName'),
                    rowHeader({ rowSpan : 2, children : targetNode.tagName }),
                    map.call(targetNode.attributes, attr => columnHeader(attr.name)),
                    // targetNode.textContent? columnHeader('textContent') : null
                ]
            }),
            row([
                // rowHeader(targetNode.tagName),
                map.call(targetNode.attributes, attr => gridCell({ value : attr.value })),
                // targetNode.textContent? gridCell(targetNode.textContent) : null
            ])
        ])
    }
}

export function nodeGrid(init) {
    return new NodeGrid('table', init)
}
