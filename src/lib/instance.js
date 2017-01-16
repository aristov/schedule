import { ARIADOMAssembler } from './ariaassembler'

Object.defineProperty(Element.prototype, 'instance', {
    enumerable : true,
    writable : true,
    value : null
})

const map = Array.prototype.map

export class Instance extends ARIADOMAssembler {
    /**
     * The base instance from which all other instances in this taxonomy inherit
     * @param {Element} element root node
     * @param {{}} init
     */
    constructor(element, init) {
        super(element, init)
        this.element.instance = this
    }

    set element(element) {
        this.node = element
    }

    get element() {
        return this.node
    }

    /**
     * Set hidden state
     * @param {String} hidden state
     */
    set hidden(hidden) {
        this.element.hidden = hidden === 'true'
    }

    /**
     * Get hidden state
     * @returns {String}
     */
    get hidden() {
        return String(this.element.hidden)
    }

    /**
     * Set disabled state
     * @param {String} disabled state
     */
    set disabled(disabled) {
        this.element.setAttribute('aria-disabled', disabled)
    }

    /**
     * Get disabled state
     * @returns {String}
     */
    get disabled() {
        return this.element.getAttribute('aria-disabled') || 'false'
    }

    /**
     * Add event listener
     * @param {String} type event type
     * @param {Function} listener event listener
     * @param {Object} [context = this] event listener context
     * @returns {Instance} this
     */
    on(type, listener, context = this) {
        this.element.addEventListener(type, listener.bind(context))
        return this
    }

    /**
     * Dispatch an event
     * @param {String} type event type
     * @param {Object} [init] event init object
     * @returns {Instance} this
     */
    emit(type, init = { bubbles : true, cancelable : true }) {
        const event = new Event(type, init)
        this.element.dispatchEvent(event)
        return this
    }

    /**
     * Find the first descendant instance of the specified class
     * @param {Instance} Class target instance class
     * @param {Function|String} [filter] function or property name
     * @param {String} [value] filter property value
     * @returns {Instance|null}
     */
    find(Class, filter, value) {
        const selector = `[role~=${Class.name.toLowerCase()}]`
        return filter?
            this.findAll(Class, filter, value)[0] || null :
            Class.getInstance(this.element.querySelector(selector))
    }

    /**
     * Find all descendant instances of the specified class
     * @param {Instance} Class target instance class
     * @param {Function|String} [filter] function or property name
     * @param {String} [value] filter property value
     * @returns {Array} array of found instances
     */
    findAll(Class, filter, value) {
        const selector = `[role~=${Class.name.toLowerCase()}]`
        const result = map.call(
            this.element.querySelectorAll(selector),
            element => Class.getInstance(element))

        if(typeof filter === 'string') {
            filter = instance => instance[filter] === value
        }
        return filter? result.filter(filter) : result
    }

    /**
     * Find the nearest ancestor instance of the specified class
     * @param {Instance} Class target instance class
     * @param {Function|String} [filter] function or property name
     * @param {String} [value] filter property value
     * @returns {Instance} found instance
     */
    closest(Class, filter, value) {
        const selector = `[role~=${Class.name.toLowerCase()}]`
        if(typeof filter === 'string') {
            filter = instance => instance[filter] === value
        }
        let instance = this
        do {
            const parent = instance.element.parentElement
            if(!parent) return null
            const closest = parent.closest(selector)
            instance = Class.getInstance(closest)
        } while(instance && filter && !filter(instance))
        return instance
    }

    /**
     * Create if needed and return the instance of the specified element
     * @param {Element} element root element node of target instance
     * @returns {Instance|null}
     */
    static getInstance(element) {
        const role = element && element.getAttribute('role')
        return role && role.split(' ').includes(this.name.toLowerCase())?
            element.instance || new this(element) :
            null
    }

    /**
     * Create if needed and return the nearest ancestor instance of the specified element
     * @param {Element} element node inside target instance
     * @returns {Instance|null}
     */
    static closestInstance(element) {
        const selector = `[role~=${this.name.toLowerCase()}]`
        const closest = element.closest(selector)
        return this.getInstance(closest)
    }

    /**
     * Delegate an event listener to the document node
     * @param {String} type event type
     * @param {Function} listener event listener
     * @param {Object} [context=this] event listener context
     */
    static on(type, listener, context = this) {
        document.addEventListener(type, event => {
            const instance = context.closestInstance(event.target)
            if(instance) listener.call(instance, event)
        }, true)
    }
}
