import { scheduleApp } from './lib/scheduleapp'

const app = scheduleApp({
    columns : 'Neo Forte Piano Sol Fa',
    time : '09:00',
    date : '2017-01-31',
    // readOnly : true,
})

document.body = app.node
