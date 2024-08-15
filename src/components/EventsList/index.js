import {Link} from 'react-router-dom'
import {useEffect, useState} from 'react'
import Cookies from 'js-cookie'

import './index.css'
import Header from '../Header'

const EventsList = () => {
  const [events , setEvents] = useState([])
  const [useraname , setUsername] = useState('')
  const [userId, setUserId] = useState("")

  useEffect(()=> {
      callToServer();         
  }, [])

  const callToServer = async() => {
    const jwtToken = Cookies.get("jwt") 
    const url = "http://localhost:3001/get-events/"
    const options = {
      method:"GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    }
    const serverRes =  await fetch(url, options)
    const serverResJsonData = await serverRes.json()

    setUserId(serverResJsonData.id)
    setUsername(serverResJsonData.username)
    setEvents(serverResJsonData.dbRes)
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
            events.map(each => {
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
                            Your browser does not support the video tag.
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
            })
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