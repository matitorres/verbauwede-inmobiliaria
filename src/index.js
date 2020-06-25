require('dotenv').config()
require('./database')
const app = require('./server')

const port = app.get('port')

app.listen(port, () => {
    console.log("Server on port: " + port)
})