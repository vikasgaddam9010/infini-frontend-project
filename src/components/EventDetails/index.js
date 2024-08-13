import { useParams } from 'react-router-dom'

const EventDetails = () => {
    const {username, event_id, userid} = useParams()

    console.log(username, event_id, userid)
    return (
    <h1>EventDetails</h1>
)
}
export default EventDetails