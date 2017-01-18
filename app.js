const fs = require('fs')
const path = require('path')

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const xmlpath = path.join(__dirname, './data/schedule.xml')

app.use(bodyParser.text());

app.post('/', ({ body }, res) => {
    if(body) {
        fs.writeFileSync(xmlpath, body)
        console.log('Save file: ' + body)
        res.send('File saved!' + fs.readFileSync(xmlpath, 'utf-8'))
    } else {
        res.send('Error! No data received!')
    }
})

app.use(express.static('.'))

app.use((req, res) => {
    res.status(404).send('Error 404: Not found!')
})

app.listen(3000, function () {
    console.log('Schedule app listening on port 3000')
})
