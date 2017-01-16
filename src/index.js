import { body } from 'htmlmodule'
import { grid, row, gridcell } from './lib/grid'

const schedule = grid({
    id : 'myschedule',
    children : [
        row({
            children : [
                gridcell({ children : '1 x 1' })
            ]
        })
    ]
})

document.body = body(schedule.node)
