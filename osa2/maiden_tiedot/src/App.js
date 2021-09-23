import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchName, setSearchName] = useState('')



  useEffect(() => {
    axios
      .get(`https://restcountries.eu/rest/v2/name/${searchName}`)
      .then(response => {
        console.log("kekkuli");
        setCountries(response.data)
      })
  }, [])

  const handleSearch = (event) => {
    setSearchName(event.target.value)
  }

  return (
    <div>
      <Search handleSearch={handleSearch} text={searchName} />
    </div>
  )
}

const Search = ({ handleSearch, text }) => {
  return (
    <div>
      find countries
      <input
        value={text}
        onChange={handleSearch}
      />
    </div>
  )
}

/*
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
*/



export default App