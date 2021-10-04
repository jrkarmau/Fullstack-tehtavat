import React, { useState, useEffect } from 'react'
import ShowPersons from './components/ShowPersons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [Message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`"${newName}" is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(person => person.name === newName)
        if (newNumber.length < 8) {
          error('Number must be minimun of 8 character')
        } else {
          personService
            .update(personToUpdate.id, personObject)
            .then(returnedPerson => {
              setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
              info(`Person "${personObject.name}" updated`)
            })
            .catch(fail => {
              console.log(fail)
              error(`"${personObject.name}" is already deleted from server`)
            })
        }
      }
    }
    else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          info(`Person "${personObject.name}" added`)
        })
        .catch(err => {
          if (newName.length < 3) {
            error('Name must be minimun of 3 character')
          } else {
            error('Number must be minimun of 8 character')
          }
          console.log(err.response.data)
        })
    }
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete "${person.name}"?`)) {
      personService
        .destroy(person.id)
      const newPersons = persons.filter(p => p.id !== person.id)
      setPersons([...newPersons])
      info(`Person "${person.name}" deleted`)
    }
  }

  const info = (text) => {
    setMessage(text)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const error = (text) => {
    setErrorMessage(text)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const handleFilter = (event) => {
    setNewFilter(event.target.value)
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={Message} />
      <ErrorNotification message={errorMessage} />
      <Filter handleFilter={handleFilter} text={newFilter} />
      <h2>Add a new</h2>
      <PersonForm newName={newName} newNumber={newNumber}
        addPerson={addPerson} handlePersonChange={handlePersonChange}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <ShowPersons persons={persons} searchName={newFilter}
        handlePersonDelete={deletePerson} />
    </div>
  )
}

export default App