import React from "react"

const ShowPersons = ({ persons, searchName, handlePersonDelete }) => {

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(searchName.toLowerCase()))

  return (
    <ul>
      {filteredPersons.map(person =>
        <SinglePerson key={person.id} person={person} handlePersonDelete={handlePersonDelete} />
      )}
    </ul>
  )
}

const SinglePerson = ({ person, handlePersonDelete }) => {
  return (
    <li>{person.name} {person.number}
      <button onClick={() => handlePersonDelete(person)}>Delete</button>
    </li>
  )
}

export default ShowPersons