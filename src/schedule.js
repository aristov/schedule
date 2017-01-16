import { thead, tbody, tr, th } from 'htmlmodule'
import { grid, row, gridcell } from './lib/grid'

const { prototype : { forEach } } = Array

// const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
const hours = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
const minutes = ['00', '30']

export function schedule() {
    return grid({
        // onkeydown,
        multiselectable : 'true',
        children : [
            thead(tr([th(), th('Neutral'), th('Do forte'), th('Do piano'), th('Sol'), th('Fa')])),
            tbody(hours.map((hour, h) => minutes.map((minute, m) => row([
                th(hour + ':' + minute),
                // gridcell({ tabIndex : h + m? -1 : 0 }),
                gridcell({}),
                gridcell({}),
                gridcell({}),
                gridcell({}),
                gridcell({}),
            ]))))
        ]
    })
}

/*================================================================*/

function onkeydown(event) {
    const { key, target, shiftKey } = event
    if(target.tagName === 'TD' && key.startsWith('Arrow')) {
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
}
