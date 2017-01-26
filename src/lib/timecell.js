import { GridCell } from 'ariamodule'

export class TimeCell extends GridCell {
    set value(value) {
        const change = this.value !== value
        super.value = value
        if(change) {
            const event = new CustomEvent('change', {
                bubbles : true,
                cancelable : true
            })
            this.node.dispatchEvent(event)
        }
    }
    get value() {
        return super.value
    }
    set owns(owns) {
        const change = this.value && owns.length !== this.owns.length
        super.owns = owns
        if(change) {
            const event = new CustomEvent('change', {
                bubbles : true,
                cancelable : true
            })
            this.node.dispatchEvent(event)
        }
    }
    get owns() {
        return super.owns
    }
    get duration() {
        return this.rowSpan * 30
    }

    get columnheader() {
        return this.grid.rows[0].cells[this.index]
    }
}

export function timecell(init) {
    return new TimeCell('td', init)
}