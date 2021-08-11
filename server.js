const express = require('express')
const cors = require('cors')
const path = require('path')
const db = require('./app/models')
const app = express()

var corsOptions = {
  origin: '*',
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'app/views'))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('*', function (req, res) {
  res.render('not_found')
})

require('./app/routes/user.routes')(app)

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database!')
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err)
    process.exit()
  })

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
