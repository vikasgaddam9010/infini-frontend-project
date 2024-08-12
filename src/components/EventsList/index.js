import {Link} from 'react-router-dom'

import './index.css'

const EventsList = () => {
  const eventList = 0

  return (
    <div className='events-container'>
      <h1>Events List</h1>
      {eventList > 0 ? (
        <>
          <Link className='btn' type='submit' to='/upload-event-data'>
            Click Here to Add Events
          </Link>
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