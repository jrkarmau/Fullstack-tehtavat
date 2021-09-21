import React from 'react'

const Filter = ({handleFilter, text}) => {
    return (
      <div>
          Filter shown with:
          <input
            value={text}
            onChange={handleFilter}
          />
      </div>
    )
  }

export default Filter
