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
     * @param {Boolean} hidden state
     */
    set hidden(hidden) {
        this.element.hidden = hidden
    }

    /**
     * Get hidden state
     * @returns {Boolean}
     */
    get hidden() {
        return this.element.hidden
    }

    /**
     * Set disabled state
     * @param {Boolean} disabled state
     */
    set disabled(disabled) {
        this.element.setAttribute('aria-disabled', disabled)
    }

    /**
     * Get disabled state
     * @returns {Boolean}
     */
    get disabled() {
        return this.element.getAttribute('aria-disabled') === 'true'
    }

    /**
     * Dispatch an event
     * @param {String} type event type
     * @param {Object} [init] event init object
     * @returns {Instance} this
     */
    emit(type, init = { bubbles : true, cancelable : true }) {
        const event = new CustomEvent(type, init)
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
        return element.instance || new this(element)
    }

    static get selector() {
        return `[role~=${ this.name.toLowerCase() }]`
    }
}
