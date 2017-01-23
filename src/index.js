import { timetable } from './lib/timetable'

const schedule = timetable({
    columns : 'Neo Fa Forte Sol Piano',
    // date : '2017-01-23',
    // time : '09:00',
})

document.body.append(schedule.node)
