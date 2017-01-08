import { table, thead, tbody, tr, th, td } from 'htmlmodule'

const { prototype : { forEach } } = Array

const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
const minutes = ['00', '30']
const ARROW_KEYS = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft']

export function schedule() {
    const grid = table({
        onkeydown : event => {
            const { key, target, shiftKey } = event
            if(target.tagName === 'TD' && ARROW_KEYS.includes(key)) {
                const row = target.parentNode
                let newRow, newCell
                switch(key) {
                    case 'ArrowUp':
                        newRow = row.previousSibling
                        event.preventDefault()
                        break
                    case 'ArrowDown':
                        newRow = row.nextSibling
                        event.preventDefault()
                        break
                    case 'ArrowLeft':
                        newCell = target.previousSibling
                        break
                    case 'ArrowRight':
                        newCell = target.nextSibling
                        break
                }
                if(newRow) newCell = newRow.cells[target.cellIndex]
                if(newCell && newCell.tagName === 'TD') {
                    if(shiftKey) {
                        target.setAttribute('aria-selected', 'true')
                        newCell.setAttribute('aria-selected', 'true')
                    }
                    else {
                        forEach.call(grid.rows, row => forEach.call(row.cells, cell => {
                            cell.removeAttribute('aria-selected')
                        }))
                        target.tabIndex = -1
                        newCell.tabIndex = 0
                        newCell.focus()
                    }
                    const current = grid.querySelector('[aria-current]')
                    if(current) current.removeAttribute('aria-current')
                    newCell.setAttribute('aria-current', 'true')
                }
            }
        },
        children : [
            thead(tr([th(), th('Neutral'), th('Do forte'), th('Do piano'), th('Sol'), th('Fa')])),
            tbody(hours.map((hour, h) => minutes.map((minute, m) => tr([
                th(hour + ':' + minute),
                td({ tabIndex : h + m? -1 : 0, children : '' }),
                td({ tabIndex : -1, children : '' }),
                td({ tabIndex : -1, children : '' }),
                td({ tabIndex : -1, children : '' }),
                td({ tabIndex : -1, children : '' }),
            ]))))
        ]
    })
    return grid
}
