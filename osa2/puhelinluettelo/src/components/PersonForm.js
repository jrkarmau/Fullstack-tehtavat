import React from "react"

const PersonForm = ({ newName, newNumber, addPerson,
    handlePersonChange, handleNumberChange }) => {
    return (
      <div>
        <form onSubmit={addPerson}>
          <div>
            Name: <input
              value={newName}
              onChange={handlePersonChange}
            />
          </div>
          <div>
            Number: <input
              value={newNumber}
              onChange={handleNumberChange}
            />
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
      </div>
    )
  }

export default PersonForm