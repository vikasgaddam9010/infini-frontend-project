import {useState} from 'react'
import {useNavigate} from 'react-router-dom'

import './index.css'

const Login = () => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const navigator = useNavigate()

  const submitHandler =  async event => {
    event.preventDefault()
    console.log(username, password)
    const url = "https://vikasbabuauasxrjscprqui5.drops.nxtwave.tech/log-in/"
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, password})
    }
    const dbRes = await fetch(url, options)
    const data = await dbRes.json()
    console.log(dbRes)
    console.log(data)


    //navigator('/events-list')
  }
  return (
    <div className='main-container'>
      <form onSubmit={submitHandler} className='form-container'>
        <h1 className='head'>Log in</h1>
        <label value={username} className='label' htmlFor='username'>
          Registered Username   
        </label>
        <input
          onChange={event => setUserName(event.target.value)}
          placeholder='USERNAME'
          className='input'
          id='username'
          type='text'
        />
        <label value={password} className='label' htmlFor='password'>
          Password
        </label>
        <input
          onChange={event => setPassword(event.target.value)}
          placeholder='PASSWORD'
          className='input'
          id='password'
          type='password'
        />
        <button type='submit' className='btn'>
          Log in
        </button>
      </form>
    </div>
  )
}

export default Login