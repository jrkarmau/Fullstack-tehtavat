import React from "react"

const Course = ({ course }) => {

    return (
      <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
        <Exercises parts={course.parts} />
      </div>
    )
}

const Exercises = ({ parts }) => {
  
    const total = parts.reduce((sum, part) => {
      return sum + part.exercises
    }, 0)
  
    return (
      <p><b>total of {total} exercises</b></p>
    )
  }
  
  const Header = ({ name }) => {
    return (
      <h2>{name}</h2>
    )
  }
  
  const Content = ({ parts }) => {
    return (
      <div>
        {parts.map(part =>
          <Part key={part.id} part={part} />
        )}
      </div>
    )
  }
  
  const Part = ({ part }) => {
    return (
      <p>{part.name} {part.exercises}</p>
    )
  }

export default Course