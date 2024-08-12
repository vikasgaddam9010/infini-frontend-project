import {Route, Routes, BrowserRouter} from 'react-router-dom'

import Registration from './components/Registration'
import Login from './components/Login'
import UploadData from './components/UploadData'
import EventsList from './components/EventsList'

import './App.css'

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route exact path='/registation' element={<Registration />} />
      <Route exact path='/login' element={<Login />} />
      <Route exact path='/events-list' element={<EventsList />} />
      <Route exact path='/upload-event-data' element={<UploadData />} />
    </Routes>
  </BrowserRouter>
)

export default App