import React, {useState, useEffect} from 'react'
import {v4} from 'uuid'
import {TiDelete} from 'react-icons/ti'
import Cookies from 'js-cookie'
import {useNavigate, useParams, Link} from 'react-router-dom'

import './index.css'
import Header from '../Header'
import LoadingView from '../LoadingView'

const renderState = {
  loader: 'loading',
  sucess: "sucess",
  initial: 'initial',
  failed: 'failed'
}

const UploadData = () => {
  const [state, setState] = useState(renderState.sucess)
  const [title, setTitle] = useState('')
  const [existingData, setExistingData] = useState([])
  const [media, setMedia] = useState([])
  const [editMode, setEditMode] = useState(false)

  const { event_id } = useParams();
  const navigator = useNavigate()
  const jwtToken = Cookies.get("jwt")

  useEffect(() => {
      if (event_id) {
      setEditMode(true);
      fetchEventDetails(event_id);
     }
    }
    , [event_id])

  const fetchEventDetails = async (id ) => {
    setState(renderState.loader)
    const url = `https://node-infini.onrender.com/get-event-details/${id}`
    const options = {
      method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        } 
    }

    const serverRes = await fetch(url, options)
    if(serverRes.ok){
      const serverResJsonData = await serverRes.json()
      setTitle(serverResJsonData.event_title)
      setExistingData(serverResJsonData)
   //   console.log(serverResJsonData)
      setState(renderState.sucess)
    }else{
      setState(renderState.failed)
    }
    
  }  
  

  const mediaUpload = async (file, typeMedia, typeUplod) => {
    const formDetails = new FormData()
    formDetails.append('file', file)
    formDetails.append('upload_preset', typeUplod)

    const url = `https://api.cloudinary.com/v1_1/dagtd0cm9/${typeMedia}/upload`

    const options = {
      method: 'POST',
      body: formDetails,
    }
    const cloudRes = await fetch(url, options)
     const r = await cloudRes.json()
     //console.log(r)
     //console.log(r.url, r.display_name)
     return {url:r.url, name:r.display_name, type: r.format}
  }


  const submitHandler = async event => {
    setState(renderState.loader)
    event.preventDefault()
    const r = media.map(eachMedia => {
      if(eachMedia.type.split("/")[0] === "image"){
        return mediaUpload(eachMedia, eachMedia.type.split("/")[0], 'image_upload')      
      }else{
        return mediaUpload(eachMedia, eachMedia.type.split("/")[0], 'video_uploads')
      }
    })
    const uploadedData = await Promise.all(r) //waits for all responses to be done.
    //console.log("upload",uploadedData)
    const files = JSON.stringify(uploadedData)

    if(title === ""){
      return alert("Plase Input All Fileds")
    }
    const eventDetails = {
      eventId: v4(),
      eventTitle: title,
      fileUrls: files
    }

    const url = editMode ? `https://node-infini.onrender.com/update-event/${event_id}/` : "https://node-infini.onrender.com/add-events/"
    
    const options = {
      method: editMode ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify(eventDetails)
    }

    const serverRes = await fetch(url, options)
    const json = await serverRes.json()
    //console.log(json)
    if(serverRes.ok){
      setState(renderState.sucess)
      return navigator('/events-list')
    }
  }

  const handleFileChange = event => {
    const filesArray = Array.from(event.target.files)
    setMedia(filesArray)
  }

  const handleToAddFiles = event => {
    const parsefied = JSON.parse(existingData.uploads)
    const selectedFiles = Array.from(event.target.files)
    //selectedFiles.map(eachFile => console.log(eachFile.name.split(".")[0]))
    //parsefied.map(eachFile => console.log(eachFile.name.split(".")[0]))
    const names = parsefied.map(each => each.name)
    //console.log(names)
    selectedFiles.filter(eachMedia => {
      console.log(names, names, eachMedia)
      const r = parsefied.filter(e => console.log(e))
    })

    /*console.log(event.target.files[0].name.split(".")[0])
    const name = event.target.files[0].name.split(".")[0]
    const r = parsefied.filter(each => each.name !== name)
    console.log(r)*/


  }

  const deleteMedia = index => {
    //console.log(index)
    const updatedMedia = media.filter((file, i) => i !== index)
    setMedia(updatedMedia)
  }

  const getEditFiles = () => {
    const {uploads} = existingData
    const result = JSON.parse(uploads)
   //console.log(result.map(each => each))
    return (
      result.length > 0 && (
        <ul className='ul'>
          {result.map((file, index) => {
            //console.log(file.username)
            return (
              <li key={index}>
                {file.name}{' '}
                <TiDelete
                  onClick={() => deleteMedia(index)}
                  className='delete-icon'
                />
              </li>
            )
          })}
        </ul>
      )
    )
}
  const getExitingFiles = () =>(
    media.length > 0 && (
      <ul className='ul'>
        {media.map((file, index) => {
          return (
            <li key={index}>
              {file.name}{' '}
              <TiDelete
                onClick={() => deleteMedia(index)}
                className='delete-icon'
              />
            </li>
          )
        })}
      </ul>
    )
  )

  const getSucessView = () => (
    <>
      <Header/>
    
    <div className='main-container'>   
      <h1>{editMode ? 'Edit Media' : 'Upload Media'}</h1>
      <form onSubmit={submitHandler} className='form-container'>
        <label className='label' htmlFor='title'>
          {editMode ? 'Edit Title' : 'Title Of Event'}
        </label>
        <input
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder='Enter Title of Media...'
          className='input title'
          id='title'
          type='text'
        />
        <label className='label' htmlFor='upload'>
        {editMode ? 'Edit Media' : 'Upload Media'}
        </label>
        {
          editMode ? (<input
            onChange={handleToAddFiles}
            id='upload'
            type='file'
            accept='.jpg,.mp4'
            multiple
          />) : (<input
            onChange={handleFileChange}
            id='upload'
            type='file'
            accept='.jpg,.mp4'
            multiple
          />)
        }       
        <div>
          {editMode ? getEditFiles() : getExitingFiles()}
        </div>
        <div className="d-flex-space-between"> 
        <button type='submit' className='btn'>
          {editMode ? 'Edit Input Fileds' : 'Upload Media'}
        </button>
        <Link to="/events-list" type="button" className='btn'>{editMode ? 'Cancel': 'Back'}</Link>
        
        </div>
      </form>
    </div>
    </>
  )

  const getFailedView = () => {
    <button>retry</button>
  }

  if(renderState.loader === state){
    return <LoadingView/>
  }else if (renderState.sucess === state){
    return getSucessView()
  }else if (renderState.failed === state) {
    return getFailedView()
  }
}

export default UploadData