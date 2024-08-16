import React, {useState, useEffect} from 'react'
import {v4} from 'uuid'
import {TiDelete} from 'react-icons/ti'
import Cookies from 'js-cookie'
import {useNavigate, useParams, Link} from 'react-router-dom'

import './index.css'
import Header from '../Header'
//import LoadingView from '../LoadingView'

const renderState = {
  loader: 'loading',
  sucess: "sucess",
  initial: 'initial',
  failed: 'failed'
}

const UploadData = () => {
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
    , [])

  const fetchEventDetails = async (id ) => {
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
      setExistingData(serverResJsonData)
      setTitle(serverResJsonData.event_title)
      const updated = JSON.parse(serverResJsonData.uploads)
      setMedia(updated)
    }else{
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
   
     return {url:r.url, name:r.display_name+"."+r.format, type: r.format}
  }


  const submitHandler = async event => {
    event.preventDefault()

    if(title === ""){
      return alert("Plase Enter the Title")
    }
    
    if(media.length === 0){
      return alert("Please Upload Photos/Videos")      
    }
    
    const r = media.map(eachMedia => {
      if(eachMedia.type.split("/")[0] === "image"){
        return mediaUpload(eachMedia, eachMedia.type.split("/")[0], 'image_upload')      
      }else{
        return mediaUpload(eachMedia, eachMedia.type.split("/")[0], 'video_uploads')
      }
    })
    const uploadedData = await Promise.all(r) //waits for all responses to be done.

    
    const files = JSON.stringify(uploadedData)

    const eventDetails = {
      eventId: v4(),
      eventTitle: title,
      fileUrls: files
    }

    const url = "https://node-infini.onrender.com/add-events/"
    
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify(eventDetails)
    }

    const serverRes = await fetch(url, options)
    await serverRes.json()
    if(serverRes.ok){
      return navigator('/events-list')
    }
  }

  const submitEditHandler = async event => {
    event.preventDefault()
    const filteredMedia = media.filter(each => each.lastModified)
    const r = filteredMedia.map(each=>{

        if(each.type.split("/")[0] === "image"){
          return mediaUpload(each, each.type.split("/")[0], 'image_upload')      
        }else{
          return mediaUpload(each, each.type.split("/")[0], 'video_uploads')      
    }})
    const uploadedData = await Promise.all(r)
    const reUploadedMedia = media.concat(uploadedData)

    const modified = reUploadedMedia.filter(each => each.url)

    modified.event_id = existingData.event_id
    modified.username = existingData.username


    const hasToUpdate = {
      title: title,
      event_id: existingData.event_id,
      username: existingData.username,
      files: JSON.stringify(modified)
    }

    const url = `https://node-infini.onrender.com/update-event-detail/`
    const options = {
      method : "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify(hasToUpdate)
      }
      const serverRes = await fetch(url, options)
   
      
      if(serverRes.ok){
        navigator(`/events-list`)
      }
  }

  const handleFileChange = event => {
    if(media.length === 0){
      const files = Array.from(event.target.files)
      setMedia(files)
    }else{
      const newFiles = Array.from(event.target.files)   

      const mergeAndRemoveDuplicates = (arr1, arr2) => {
          const combined = [...arr1, ...arr2];
          const uniqueMap = new Map();
          combined.forEach(item => {            
              if (!uniqueMap.has(item.name)) {
                  uniqueMap.set(item.name, item);
              }
          });
          return Array.from(uniqueMap.values());
      };
      const result = mergeAndRemoveDuplicates(media, newFiles);
      setMedia(result);
    }
  }

  const deleteMedia = name => {
    const result = media.filter(each => each.name !== name)
    setMedia(result)
  }

const getEachMediaName = () =>(
    media.length > 0 && (
      <ul className='ul'>
        {media.map((file) => {
          return (
            <li key={file.name}>
              {file.name}{' '}
              <TiDelete
                onClick={() => deleteMedia(file.name)}
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
      <form onSubmit={editMode ? submitEditHandler : submitHandler} className='form-container'>
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
        <input
            onChange={handleFileChange}
            id='upload'
            type='file'
            accept='.jpg,.mp4,'
            multiple
          />   
        <div>
          {getEachMediaName()}
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

  return getSucessView()
}

export default UploadData