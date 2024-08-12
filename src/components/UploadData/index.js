import React, {useState} from 'react'
import {TiDelete} from 'react-icons/ti'
import {useNavigate} from 'react-router-dom'

import './index.css'

const UploadData = () => {
  const [title, setTitle] = useState('')
  const [media, setMedia] = useState([])
  const navigator = useNavigate()

  const submitHandler = event => {
    event.preventDefault()
    console.log('Title:', title)
    console.log('Media:', media)
    navigator('/events-list')
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
        <button type='submit' className='btn'>
          Upload Media
        </button>
      </form>
    </div>
  )
}

export default UploadData