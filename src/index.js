import { body } from 'htmlmodule'
import { schedule } from './schedule'

const app = schedule()

document.body = body(app.node)


