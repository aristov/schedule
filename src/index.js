import { body } from 'htmlmodule'
import { schedule } from './schedule'

document.body = body(schedule().node)
