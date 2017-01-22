import { timetable } from './lib/timetable'

const schedule = timetable()

document.body.append(schedule.node)
