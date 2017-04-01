import { Application } from 'ariamodule'
import { timeGrid } from './timegrid'
import { schedule } from './schedule'
import moment from 'moment'

export class ScheduleApp extends Application {

    init(init) {
        init.onchange = this.onChange.bind(this)
        this.children = timeGrid(init)
        // if(!init.date) this.date = moment().format('YYYY-MM-DD')
        schedule().then(instance => {
            this.schedule = this.data = instance
        })
    }

    onChange(event) {
        if(event.target.tagName === 'TABLE') {
            this.schedule = this.data
        }
    }

    set schedule(schedule) {
        schedule.reserves.forEach(reserve => {
            this.grid.data = reserve
        })
    }

    get grid() {
        return this.firstChild.assembler
    }
}

export function scheduleApp(init) {
    return new ScheduleApp('body', init)
}
