import {Link} from 'react-router-dom'
import {useEffect, useState} from 'react'
import Cookies from 'js-cookie'

import './index.css'
import Header from '../Header'
import LoadingView from '../LoadingView'

const renderState = {
  loader: 'loading',
  sucess: "sucess",
  initial: 'initial',
  failed: 'failed'
}

const EventsList = () => {
  const [state, setState] = useState(renderState.initial)
  const [events , setEvents] = useState([])
  const [useraname , setUsername] = useState('')
  const [userId, setUserId] = useState("")

  useEffect(()=> {
      callToServer();         
  }, [])

  const callToServer = async() => {
    setState(renderState.loader)
    const jwtToken = Cookies.get("jwt") 
    const url = "https://node-infini.onrender.com/get-events/"
    const options = {
      method:"GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    }
    const serverRes =  await fetch(url, options)

    if(serverRes.ok){
      const serverResJsonData = await serverRes.json()
      setUserId(serverResJsonData.id)
      setUsername(serverResJsonData.username)
      setEvents(serverResJsonData.dbRes)
      setState(renderState.sucess)
    }else{
      setState(renderState.failed)
    }    
  }

  const sucessView = () => {
    return (events.map(each => {
      const  z = JSON.parse(each.uploads)
      let sizeOfUploads = z.slice(0, 2)
      return (
        <li className='each-li' key={each.event_id}>
          <div className='li-details-section'>
          <p>Title:-{each.event_title}</p>
          <p>ID:- {each.event_id}</p>

          </div>
          <div className='li-images-section'>             
            < div className='center'>
            {
              sizeOfUploads.map((each, index) => {
                const type = each.url.split(".").pop()
                
                  if(type === "jpg"){
                    return <img key={index} className='video' src={each.url}/>
                  }else if (type === "mp4"){
                    return <video key={index} className='video'>
                    <source src={each.url} />
                  </video>                          
                  }                                         
              }                      
              )
            }
              <Link to={`/${useraname}/${each.event_id}/mode=${userId}`}>more</Link>
            </div>
          </div>             
        </li>
      )
    }))
  }

  const failedView = () => (
    <button type="button" onClick={callToServer}></button>
  )


  const getstateWiseVIew = () => {
    if(renderState.loader === state){
      return <LoadingView/>
    }    
    else if (renderState.sucess === state){
      return sucessView()
    }else if(renderState.failed === state){
      return failedView()
    }
  }

  return (
    <>
    <Header/>
    
    <div className='events-container'>
      <h1>Events List</h1>
      {events.length > 0 ? (
        <>
        <ul className='event-ul'>
          {
            getstateWiseVIew()
          }
        

        </ul>
          
          <Link className='btn' type='submit' to='/upload-event-data'>
            Click Here to Add Events
          </Link>
          
        </>
      ) : (
        <>
          <div className='list-container'>
            <h1>No Events</h1>
          </div>
          <Link className='btn' type='submit' to='/upload-event-data'>
            Click Here to Add Events
          </Link>
        </>
      )}
    </div>
    </>    
  )
}

export default EventsList