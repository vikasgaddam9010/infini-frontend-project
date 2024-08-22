import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Registration from './components/Registration';
import Login from './components/Login';
import UploadData from './components/UploadData';
import EventsList from './components/EventsList';
import EventDetails from './components/EventDetails';
import ProtectedRouting from './ProtectedRouting';
import GusetEventDetails from './components/GusetEventDetails'

import './App.css';

const App = () => {
  document.title = "Event Saver"
  
  return (
  <BrowserRouter>
    <Routes>
      <Route path='/register/' element={<Registration />} />
      <Route path='/login/' element={<Login />} />
      <Route exact path='/:username/:userid/mode=GUEST' element={<GusetEventDetails/>}/>
      <Route element={<ProtectedRouting />}>
        <Route path='/events-list/' element={<EventsList />} />
        <Route path='/upload-event-data/' element={<UploadData />} />
        <Route path='/edit-event-data/:event_id/' element={<UploadData />} />
        <Route path='/:username/:event_id/:userid/' element={<EventDetails />} />
        
      </Route>
    </Routes>
  </BrowserRouter>
)}

export default App;
