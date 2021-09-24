import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [allCountries, setAllCountries] = useState([])
  const [searchName, setSearchName] = useState('')



  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log("kekkuli")
        setAllCountries(response.data)
      })
      .catch(erorro => console.log("error"))
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

export default App