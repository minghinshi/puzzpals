const express = require('express')
const app = express()
const PORT = 9660

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`)
})
