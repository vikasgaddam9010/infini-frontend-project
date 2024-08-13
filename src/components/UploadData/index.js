import React, {useState} from 'react'
import {v4} from 'uuid'
import {TiDelete} from 'react-icons/ti'
import Cookies from 'js-cookie'
import {useNavigate, Link} from 'react-router-dom'

import './index.css'
import Header from '../Header'

const UploadData = () => {
  const [title, setTitle] = useState('')
  const [media, setMedia] = useState([])
  const navigator = useNavigate()

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
     return r.url
  }

  const submitHandler = async event => {
    event.preventDefault()
    const r = media.map(eachMedia => {
      if(eachMedia.type.split("/")[0] === "image"){
        return mediaUpload(eachMedia, eachMedia.type.split("/")[0], 'image_upload')      
      }else{
        return mediaUpload(eachMedia, eachMedia.type.split("/")[0], 'video_uploads')
      }
    })
    const uploadedData = await Promise.all(r) //waits for all responses to be done.
    const fileUrls = uploadedData.join(" ")
    if(title === ""){
      return alert("Plase Input All Fileds")
    }
    const eventDetails = {
      eventId: v4(),
      eventTitle: title,
      fileUrls: fileUrls      
    }

    const url = "https://vikasbabuauasxrjscprqui5.drops.nxtwave.tech/add-events/"
    const jwtToken = Cookies.get("jwt")
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${jwtToken}`
      },
      body: JSON.stringify(eventDetails)
    }

    const serverRes = await fetch(url, options)
    const json = await serverRes.json()
    console.log(json)
    if(serverRes.ok){
      return navigator('/events-list')
    }
  }

  const handleFileChange = event => {
    const filesArray = Array.from(event.target.files)
    setMedia(filesArray)
  }

  const deleteMedia = index => {
    console.log(index)
    const updatedMedia = media.filter((file, i) => i !== index)
    setMedia(updatedMedia)
  }

  return (
    <>
      <Header/>
    
    <div className='main-container'>
      
      <h1>Upload Media</h1>
      <form onSubmit={submitHandler} className='form-container'>
        <label className='label' htmlFor='title'>
          Title Of Event
        </label>
        <input
          onChange={event => setTitle(event.target.value)}
          placeholder='Enter Title of Media...'
          className='input title'
          id='title'
          type='text'
        />
        <label className='label' htmlFor='upload'>
          Upload Media
        </label>
        <input
          onChange={handleFileChange}
          id='upload'
          type='file'
          accept='.jpg,.mp4'
          multiple
        />
        <div>
          {media.length > 0 && (
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
          )}
        </div>
        <div className="d-flex-space-between"> 
        <button type='submit' className='btn'>
          Upload Media
        </button>
        <Link to="/events-list" type="button" className='btn'>Back</Link>
        </div>
      </form>
    </div>
    </>
  )
}

export default UploadData