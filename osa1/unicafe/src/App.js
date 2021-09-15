import React, { useState } from 'react'

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>Give Feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="Good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="Neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="Bad" />
      <h1>Statistics</h1>
      <Statistics goodValue={good} neutralValue={neutral} badValue={bad} />
    </div>
  )
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)


const Statistics = ({ goodValue, neutralValue, badValue }) => {

  let all = goodValue + neutralValue + badValue
  let average = ((goodValue*1 + neutralValue*0 + badValue*-1)/all).toFixed(2)
  let positive = (goodValue/all*100).toFixed(2) + "%"
  if (all === 0) return <div><b>No feedback given</b></div>

  return (
    <div>
      <StatisticLine text="Good:" value={goodValue}/>
      <StatisticLine text="Neutral:" value={neutralValue}/>
      <StatisticLine text="Bad:" value={badValue}/>
      <StatisticLine text="All:" value={all}/>
      <StatisticLine text="Average:" value={average}/>
      <StatisticLine text="Positive:" value={positive}/>
    </div>
  )
}


const StatisticLine = ({text, value}) => (
  <>{text} {value}<br></br></>
)


export default App