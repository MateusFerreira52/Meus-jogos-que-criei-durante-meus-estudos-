const express = require('express')
const app = express()
const path = require('path')

app.use(express.static(path.join(__dirname, '../public')))

app.get('/', (req, res) => {
    res.redirect('/index.html')
})



app.listen(4000, () => console.log('Server is running on port 4000'))