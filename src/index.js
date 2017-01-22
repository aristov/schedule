import { timetable } from './lib/timetable'

const schedule = timetable({
    date : '2017-01-22'
})

document.body.append(schedule.node)
