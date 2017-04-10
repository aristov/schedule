const path = require('path')
const fs = require('fs')
const xmldom = require('xmldom')

const fileName = '22-rdf-syntax-ns.rdf'
const filePath = path.resolve(__dirname, fileName)
const file = fs.readFileSync(filePath, 'utf-8')

const parser = new xmldom.DOMParser
const dom = parser.parseFromString(file, 'application/xml')

console.log(dom)

