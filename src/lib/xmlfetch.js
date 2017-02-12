const parser = new DOMParser

export function xmlFetch(url) {
    return fetch(url)
        .then(res => res.text())
        .then(xml => {
            return parser.parseFromString(xml, 'text/xml')
        })
}

export function htmlFetch(url) {
    return fetch(url)
        .then(res => res.text())
        .then(html => {
            return parser.parseFromString(html, 'text/html')
        })
}
