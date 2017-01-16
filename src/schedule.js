import { thead, tbody, tr, th, htmldom } from 'htmlmodule'
import { grid, row, gridcell } from './lib/grid'

const hours = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
const minutes = ['00', '30']

export function time(init) {
    return htmldom('time', init)
}

export function schedule() {
    return grid({
        multiselectable : 'true',
        // onchange : (event) => { console.log(event) },
        children : [
            thead(tr([
                th(),
                th('Neo hall'),
                th('Do forte'),
                th('Do piano'),
                th('Sol studio'),
                th('Fa studio')])),
            tbody(hours.map((hour, h) =>
                minutes.map((minute, m) => row([
                    th(time(hour + ':' + minute)),
                    gridcell(),
                    gridcell(),
                    gridcell(),
                    gridcell(),
                    gridcell(),
                ]))))
        ]
    })
}
