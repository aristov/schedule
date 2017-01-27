import { GridCell } from 'ariamodule'

export class TimeCell extends GridCell {

    set reservation(reservation) {
        this.loading = true
        this.value = reservation.textContent
        this.duration = reservation.duration
        this.loading = false
    }

    // fixme +
    set value(value) {
        const change = this.value !== value
        super.value = value
        if(change && !this.loading) {
            this.emit('change')
        }
    }

    // fixme +
    get value() {
        return super.value
    }

    // fixme +
    set owns(owns) {
        const change = this.value && owns.length !== this.owns.length
        super.owns = owns
        if(change && !this.loading) {
            this.emit('change')
        }
    }

    // fixme +
    get owns() {
        return super.owns
    }

    // fixme +
    emit(eventType) {
        const event = new CustomEvent(eventType, {
            bubbles : true,
            cancelable : true
        })
        this.node.dispatchEvent(event)
    }

    // fixme +
    replaceWith(cell) {
        if(this.value && cell) {
            if(this.owns.length) this.owns = []
            if(cell.owns.length) cell.owns = []
            const rows = this.grid.rows
            const index1 = this.row.index
            const index2 = cell.row.index
            const row1 = rows[index1].node
            const row2 = rows[index2].node
            const ref1 = this.node.nextSibling
            const ref2 = cell.node.nextSibling
            row1.insertBefore(cell.node, ref1)
            row2.insertBefore(this.node, ref2)
            this.focus()
            this.emit('change')
        }
    }

    // fixme +
    onArrowKeyDown(event) {
        if(event.altKey) {
            switch(event.key) {
                case 'ArrowLeft': this.replaceWith(this.prev); break
                case 'ArrowRight': this.replaceWith(this.next); break
                case 'ArrowUp': this.replaceWith(this.topSibling); break
                case 'ArrowDown': this.replaceWith(this.bottomSibling); break
            }
        } else super.onArrowKeyDown(event)
    }

    // fixme => rowSpan +
    set duration(duration) {
        const rowSpan = duration / 30
        const index = this.row.index
        const owns = this.column.slice(index + 1, index + rowSpan)
        if(owns.length) this.owns = owns
    }

    /*set duration(duration) {
        this.rowSpan = duration / 30
    }*/

    get duration() {
        return this.rowSpan * 30
    }

    // fixme +
    get columnheader() {
        return this.grid.rows[0].cells[this.index]
    }
}

export function timecell(init) {
    return new TimeCell('td', init)
}
