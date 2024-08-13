import {Link} from 'react-router-dom'
import {useEffect, useState} from 'react'
import Cookies from 'js-cookie'

import './index.css'

const EventsList = () => {
  const [events , setEvents] = useState([])
  const [eventList , setEventList] = useState([])
  useEffect(()=> {
      callToServer();         
  }, [])

  const callToServer = async() => {
    const jwtToken = Cookies.get("jwt")
    console.log(jwtToken) 
    const url = "https://vikasbabuauasxrjscprqui5.drops.nxtwave.tech/get-events/"
    const options = {
      method:"GET",
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    }
    const serverRes =  await fetch(url, options)
    const serverResJsonData = await serverRes.json()
    setEvents(serverResJsonData)

    const mediaItems = serverResJsonData[0].uploades.split(", ")
    setEventList(mediaItems)
  }
  console.log(eventList)
  console.log(events)
  return (
    <div className='events-container'>
      <h1>Events List</h1>
      {eventList.length > 0 ? (
        <>
          <Link className='btn' type='submit' to='/upload-event-data'>
            Click Here to Add Events
          </Link>
          {
            eventList.map(each => (<img src={each}/>))
          }
          <h1>Vikas</h1>
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
  )
}

export default EventsList