import {useState, useEffect} from 'react'
import {useNavigate, Link, redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const renderState = {
  loader: 'loading',
  sucess: "sucess",
  initial: 'initial',
  failed: 'failed'
}

const Login = () => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [state, setState] = useState(renderState.initial)
  const [errMsg, setErrMsg] = useState('')
  const navigator = useNavigate()

  useEffect(() => {
    const jwt = Cookies.get("jwt")
    if(jwt){
      return navigator("/events-list/")
    }
  }, [])

  const submitHandler =  async event => {
    event.preventDefault()
    
    if(username === "" || username === undefined){
      return alert("Plase Enter Username...")
    }
    if(password === "" || password === undefined){
      return alert("Plase Enter Password...")
    }

    setState(renderState.loader)
    const url = "https://node-infini.onrender.com/log-in/"
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({username, password})
    }
    const dbRes = await fetch(url, options)
    const data = await dbRes.json()
    setErrMsg(data.message)
       
    if(dbRes.ok){
      setState(renderState.sucess) 
      Cookies.set("jwt", data.jwtToken, {expires: 30})
      navigator('/events-list')

    }
  }
  //Cookies.remove('jwt');\
  
  const apiStatus = renderState.loader === state ? "Logging In...":"Log In"
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
          {apiStatus}
        </button>
        <p>{errMsg}</p>
        <Link to="/register/" className='login-btn'>
          Registration
        </Link>
      </form>
    </div>
  )
}

export default Login