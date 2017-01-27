import { timegrid } from './lib/timegrid'

const schedule = timegrid({
    columns : 'Neo Forte Piano Sol Fa',
    // date : '2017-01-23',
    time : '09:00',
})

document.body.append(schedule.node)
