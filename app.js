const express = require('express')
const estatic = require('express-static')
const fs = require('fs')
const app = express()

app.use(estatic(__dirname + '/'))

/*app.get('/', function (req, res) {
    const file = fs.readFileSync('index.html', 'utf-8')
    res.send(file)
})*/
/*app.get('/src/schedule.css', function (req, res) {
    const file = fs.readFileSync('src/schedule.css', 'utf-8')
    res.send(file)
})
app.get('/build/build.index.js', function (req, res) {
    const file = fs.readFileSync('build/build.index.js', 'utf-8')
    res.send(file)
})*/

app.listen(3000)
