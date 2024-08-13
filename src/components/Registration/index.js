import {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {v4} from 'uuid'

import './index.css'

const Registration = () => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [dbRes , setDbRes] = useState('')
  const navigator = useNavigate()

  const submitHandler = async event => {
    event.preventDefault()
    if(username !== "" && password !== ""){
      const url = 'https://vikasbabuauasxrjscprqui5.drops.nxtwave.tech/register/'
      const options = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body : JSON.stringify({id: v4(), username, password})
      }
      //console.log({id: v4(), username, password})
      const dbRes = await fetch(url, options)
      const data = await dbRes.json()
      setDbRes(data.message)
      if(dbRes.ok){
        navigator('/login') }
      }else{
        return alert("Please Input Username and Password")
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
        <Link to="/login/" className='login-btn'>
          Login
        </Link>
        <p>{dbRes}</p>
      </form>
    </div>
  )
}

export default Registration