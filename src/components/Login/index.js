import {useState} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

const Login = () => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const navigator = useNavigate()

  const submitHandler =  async event => {
    event.preventDefault()
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
      Cookies.set("jwt", data.jwtToken, {expires: 30})
      navigator('/events-list')
    }
  }
  //Cookies.remove('jwt');
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
        <p>{errMsg}</p>
        <Link to="/registration/" className='login-btn'>
          Registration
        </Link>
      </form>
    </div>
  )
}

export default Login