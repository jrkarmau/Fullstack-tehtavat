import React, { useState, useEffect } from 'react'
import ShowPersons from './components/ShowPersons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

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
      number: newNumber,
      id: newName
    }
    if (persons.some(person => person.name === newName)) {
      if (window.confirm(`"${newName}" is already added to phonebook, replace the old number wit a new one?`)) {
        let personToUpdate = persons.find(person => person.name === newName)
        personService
          .update(personToUpdate.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson))
          })
      }

    } else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete "${person.name}"?`)) {
      personService
        .destroy(person.id)
      const newPersons = persons.filter(p => p.id !== person.id)
      setPersons([...newPersons])
    }
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