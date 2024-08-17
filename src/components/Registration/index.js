import {useState, useEffect} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {v4} from 'uuid'
import Cookies from 'js-cookie'

import './index.css'

const renderState = {
  loader: 'loading',
  sucess: "sucess",
  initial: 'initial',
  failed: 'failed'
}

const Registration = () => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [dbRes , setDbRes] = useState('')
  const [state, setState] = useState('')
  const navigator = useNavigate()

  useEffect(() => {
    const jwt = Cookies.get("jwt")
    if(jwt){
      return navigator("/events-list/")
    }
  }, [])

  const submitHandler = async event => {
    event.preventDefault()
    
    if(username === undefined || username === ""){
      return alert("PLease Enter Username")
    }
    if(password === undefined || password === ""){
      return alert("PLease Enter Password")
    }
    else{
      setState(renderState.loader)
      const url = 'https://node-infini.onrender.com/register/'
      const options = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body : JSON.stringify({id: v4(), username, password})
      }

      const dbRes = await fetch(url, options)
      const data = await dbRes.json()
      setDbRes(data.message)
      if(dbRes.ok){
        setState(renderState.sucess)
        navigator('/login') }
      else{
        setState(renderState.failed)
      }
    }
  }
  const apiState = state === renderState.loader ? "Registering" : "Register"
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
        {apiState}
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