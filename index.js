const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())
app.use(express.static('build'))

app.use(morgan((tokens, request, response) => {
  let data = ''
  if (tokens.method(request, response) === 'POST') {
    data = JSON.stringify(request.body)
  }
  return [
    tokens.method(request, response),
    tokens.url(request, response),
    tokens.status(request, response),
    tokens.res(request, response, 'content-length'), '-',
    tokens['response-time'](request, response), 'ms',
    data
  ].join(' ')
}))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook<h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const numPersons = persons.length
  date = new Date()
  response.send(`
    <p>Phonebook has info for ${numPersons} people</p>
    <p>${date}</p>
  `)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    response.json(person)
  }
  else{
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()
})

const generateID = () => {
  const maxID = Number.MAX_SAFE_INTEGER
  do {
    newID = Math.floor(Math.random() * maxID)
  } while (persons.find(p => p.id === newID))

  return newID
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({
      error: 'name already exists in phonebook'
    })
  }

  const person = {
    id: generateID(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
