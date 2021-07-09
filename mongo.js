const mongoose = require('mongoose')

const password = process.argv[2]

const url = 
  `mongodb+srv://notkyle:${password}@cluster0.9x4sb.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})

const personSchema =  new mongoose.Schema({
  // id: mongoose.ObjectID,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// If 3 arguments are given, display all entries of phonebook
if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log("phonebook:")
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

// If 5 arguments are given, add new person to database
else if (process.argv.length === 5) {
  // new_id = new mongoose.Types.ObjectID()
  const person = new Person({
    // id: new_id,
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(result => {
    console.log(`added ${process.argv[3]}, number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })
}
else {
  console.log('Usage: node mongo.js mongo_password [new_name new_number]')
  process.exit(1)
}
