import {json, useNavigate, useParams} from 'react-router-dom'
import {useEffect, useState} from 'react'
import Cookies from 'js-cookie'

import Modal from 'react-modal';
import { WhatsappShareButton, TelegramShareButton, WhatsappIcon, TelegramIcon } from 'react-share';


import Header from '../Header'
import LoadingView from '../LoadingView'
import './index.css'

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
        console.log(serverResJsonData)


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
            console.log(sjsonData)
            return navigator("/events-list/")
        }   
    }

    const getSccussView = () => (
        <>
        <Header/>
        
        <div className='main'>
        
        <div className='event-container'>
            <div className='event-details-d-flex'>
                <div >
                    <h1>Uploader Name: <span>{eventDetails.username}</span></h1>
                    <p>Event Title: <span>{eventDetails.event_title}</span></p>
                </div>
                <div className='column'>
                    <button onClick={() => navigator(`/edit-event-data/${event_id}`)} style={{color: 'blue', border:"1px solid blue"}} className='button-edit-delete'>Edit</button>
                    <button style={{color: 'brown', border:"1px solid brown"}} className='button-edit-delete'>Share</button>
                    <button onClick={handleToDeleteEvent} style={{color: 'red', border:"1px solid red"}} className='button-edit-delete'>Delete</button>
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