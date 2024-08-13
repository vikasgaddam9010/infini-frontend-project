import './index.css'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'

const Header = () =>{
    const navigator = useNavigate()
    return (
    <div className="header">
        <button className='btn logout-btn' onClick={()=> {Cookies.remove('jwt'); navigator('/login')}}>Log out</button>
        <hr className='hr'/>
    </div>
)}

export default Header