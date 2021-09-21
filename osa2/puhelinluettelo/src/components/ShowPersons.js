import React from "react"

const ShowPersons = ({ persons, filter }) => {
    
    let filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

    return (
      <ul>
        {filteredPersons.map(person =>
          <SinglePerson key={person.id} person={person} />
        )}
      </ul>
    )
  }
  
  const SinglePerson = ({ person }) => {
    return (
      <li>{person.name} {person.number} </li>
    )
  }

export default ShowPersons