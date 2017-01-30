import { RowGroup } from 'ariamodule'
import moment from 'moment'

export class TimeSheet extends RowGroup {
    set data(data) {
        if(moment(data.time, 'x').format('YYYY-MM-DD') === this.dataset.date) {
            this.rows.forEach(row => row.data = data)
        }
    }
}

export function timeSheet(init) {
    return new TimeSheet('tbody', init)
}
