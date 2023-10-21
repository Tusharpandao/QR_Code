import React, { useState } from 'react'

const Card = () => {

  let [input ,setInput]=useState('')
  return (
    <div>
      <h1>Card</h1>
    <form>
      <input type="text"
       className='input'
       value={input}
       onChange={(e)=> setInput(e.target.value)}
       required/>
    </form>

    </div>
  )
}

export default Card