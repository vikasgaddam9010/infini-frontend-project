import {useNavigate, useParams} from 'react-router-dom'
import {useEffect, useState} from 'react'
import Cookies from 'js-cookie'
import Popup from 'reactjs-popup'

import Header from '../Header'
import LoadingView from '../LoadingView'
import './index.css'
import CopyButton from '../CopyButton'

const renderState = {
    loader: 'loading',
    sucess: "sucess",
    initial: 'initial',
    failed: 'failed'
}

const EventDetails = () => {
    const {event_id } = useParams()
    const [eventDetails, setEventDetails] = useState("")
    const [mediaLinks, setMedialinks] = useState("")
    const [state, setState] = useState(renderState.initial)
    const navigator = useNavigate()

    useEffect(() => {getFullList()}, [])

    const getFullList = async () => {
        setState(renderState.loader)
        const url = `https://node-infini.onrender.com/all-items/${event_id}/`
        const jwtToken = Cookies.get("jwt")
        const options = {
            method: "GET",
            headers: {
                "Authorization" : `Bearer ${jwtToken}`,                
            }
        }
        const serverRes = await fetch(url, options)

        const serverResJsonData = await serverRes.json()
        if(serverRes.ok){
            setEventDetails(serverResJsonData.dbRes)
            const updatedMedia = serverResJsonData.dbRes.uploads
            setMedialinks(JSON.parse(updatedMedia))
            setState(renderState.sucess)
        }else{
            setState(renderState.failed)
        }   
    }  

    const handleToDeleteEvent = async () => {
        const url = `https://node-infini.onrender.com/delete/${event_id}`
        const jwtToken = Cookies.get("jwt")
        const options = {
            method: "DELETE",
            headers: {
                "Authorization" : `Bearer ${jwtToken}`,                
            }
        }
        const serverRes = await fetch(url, options)   

        if(serverRes.ok){
            const sjsonData = await serverRes.json()
            return navigator("/events-list/")
        }       
    }

    let link 

    if(eventDetails !== undefined){
        link=`https://infini-frontend-project.vercel.app/${eventDetails.username}/${eventDetails.event_id}/mode=GUEST`
    }

    const getSccussView = () => (
        <>
        <Header/>        
        <div className='main'>        
        <div className='event-container'>
            <div className='event-details-d-flex'>
                <div >
                    <h1>Uploader Name: <span>{eventDetails.username.toUpperCase()}</span></h1>
                    <p>Event Title: <span>{eventDetails.event_title}</span></p>
                </div>
                <div className='column'>
                    <button onClick={() => navigator(`/edit-event-data/${event_id}`)} style={{color: 'blue', border:"1px solid blue"}} className='button-edit-delete'>Edit</button>
                    <Popup
                        modal
                        trigger={
                        <button type="button"  style={{color: 'green', border:"1px solid green"}} className="button-edit-delete">
                            Share
                        </button>
                        }
                    >
                        {close => (
                        <div className='pop-up-container' style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-around"}}>
                            <div style={{display:'flex', justifyContent:"center"}}>
                                <span>Click to Copy the Link</span>
                                <CopyButton textToCopy={link}/>
                            </div>
                            <button
                                type="button"
                                style={{color: 'black', border:"1px solid black", padding:"5px 12px", borderRadius:"3px", backgroundColor:"white"}}
                                onClick={() => close()}
                                >
                                Close
                            </button>
                        </div>
                        )}
                    </Popup>
                    <Popup
                        modal
                        trigger={
                            <button  style={{color: 'red', border:"1px solid red"}} className='button-edit-delete'>Delete</button>
                        }
                    >
                        {close => (
                        <div className='pop-up-container' style={{padding:"30px 50px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-between"}}>
                            <p style={{padding:"0px", margin:"0px"}}>Are You Sure To Delete Event ???</p>
                            <p style={{fontSize:"28px", padding:"0px", margin:"0px"}}>😲</p>
                            <div>
                            <button type="button"
                                style={{color: 'red',marginRight:"10px", border:"1px solid red", padding:"5px 12px", borderRadius:"3px", backgroundColor:"white"}} onClick={handleToDeleteEvent}>Yes ❌</button>                            
                            <button
                                type="button"
                                style={{color: 'green', marginLeft:"10px",   border:"1px solid green", padding:"5px 12px", borderRadius:"3px", backgroundColor:"white"}}
                                onClick={() => close()}
                                >
                                No ✔️
                            </button>
                            </div>                            
                        </div>
                        )}
                    </Popup>
                    
                </div>
            </div>
        <div className='list'>
        {
            mediaLinks.length > 0 && mediaLinks.map((each, index )=> {                
                const type = each.url.split(".").pop()
                if(type === "mp4"){
                    return <video key={index} controls className="each-img" name="media"><source src={each.url} type='video/mp4' /></video>
                }else if( type === "jpg"){
                    return <img  className="each-img" key={index} src={each.url}/>
                }
            })    
        }
        </div>
        </div>
    </div>
    </>
    )

    const getFailedView = () => (
        <div className='loader-container'>
            <button className='btn' onClick={() => getFullList()}>Retry</button>
        </div>
    )
    if(state === renderState.loader){
        return <LoadingView/>
    }else if(state === renderState.sucess){
        return getSccussView()
    }else if(state === renderState.failed){
        return getFailedView()
    }
}
export default EventDetails
