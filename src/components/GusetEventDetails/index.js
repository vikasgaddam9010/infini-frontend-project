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

const GusetEventDetails = () => {
    const {userid } = useParams()
    const [eventDetails, setEventDetails] = useState("")
    const [mediaLinks, setMedialinks] = useState("")
    const [state, setState] = useState(renderState.initial)

    useEffect(() => {getFullList()}, [])

    const getFullList = async () => {
        setState(renderState.loader)
        const url = `https://node-infini.onrender.com/get-guest-all-items/${userid}/`
        const options = {
            method: "GET",
        }
        const serverRes = await fetch(url, options)
        const serverResJsonData = await serverRes.json()
        
        if(serverRes.ok){
            setEventDetails(serverResJsonData.message[0])
            const updatedMedia = serverResJsonData.message[0].uploads
            setMedialinks(JSON.parse(updatedMedia))
            setState(renderState.sucess)
        }else{
            setState(renderState.failed)
        } 
    }  

    const link=`https://infini-frontend-project.vercel.app/${eventDetails.username}/${eventDetails.event_id}/mode=GUEST`

    const getSccussView = () => (
        <>      
        <div className='main-guest'>        
        <div className='event-container'>
            <div className='event-details-d-flex'>
                <div >
                    <h1>Uploader Name: <span>{eventDetails.username}</span></h1>
                    <p>Event Title: <span>{eventDetails.event_title}</span></p>
                </div>
                <div className='column'>
                    <button  disabled style={{color: 'grey', cursor:'not-allowed', border:"1px solid grey"}} className='button-edit-delete'>Edit</button>
                    <Popup
                        modal
                        trigger={
                        <button type="button" style={{color: 'brown', border:"1px solid brown"}} className="button-edit-delete">
                            Share
                        </button>
                        }
                    >
                        {close => (
                        <div className='pop-up-constainer' style={{display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"space-around"}}>
                            <div style={{display:'flex', justifyContent:"center"}}>
                                <span>Click Copy Icon to Copy the Link</span>
                                <CopyButton textToCopy={link}/>
                            </div>
                            <button
                                type="button"
                                style={{color: 'black', border:"1px solid brown", borderRadius:"5px", padding:"5px 10px"}}
                                onClick={() => close()}
                                >
                                Close
                            </button>
                        </div>
                        )}
                    </Popup>
                    <button disabled style={{color: 'grey', cursor:'not-allowed', border:"1px solid grey"}} className='button-edit-delete'>Delete</button>
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


export default GusetEventDetails