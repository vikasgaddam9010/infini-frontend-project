import {useState} from 'react'
import {json, useNavigate} from 'react-router-dom'

import './index.css'

const Registration = () => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const navigator = useNavigate()

  const submitHandler = async event => {
    event.preventDefault()
    //console.log(userName, password)
    const url = 'https://vikasbabuauasxrjscprqui5.drops.nxtwave.tech/register/'
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body : JSON.stringify({username, password})
    }
    const dbRes = await fetch(url, options)
    const data = await dbRes.json()
    console.log(dbRes)
    console.log(data.message)
    if(dbRes.ok){
      navigator('/login')
    }
  }

  return (
    <div className='main-container'>
      <form onSubmit={submitHandler} className='form-container'>
        <h1 className='head'>Registration</h1>
        <label value={username} className='label' htmlFor='username'>
          USERNAME
        </label>
        <input
          onChange={event => setUserName(event.target.value)}
          placeholder='USERNAME'
          className='input'
          id='username'
          type='text'
        />
        <label value={password} className='label' htmlFor='password'>
          UPASSWORD
        </label>
        <input
          onChange={event => setPassword(event.target.value)}
          placeholder='PASSWORD'
          className='input'
          id='password'
          type='password'
        />
        <button type='submit' className='btn'>
          Register Here
        </button>
      </form>
    </div>
  )
}

export default Registration