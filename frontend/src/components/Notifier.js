import { useSelector } from 'react-redux'

const Notifier = () => {
    const notification = useSelector(i => i.notification)
    return(
        <div className = {notification.type}>
            {notification.message}
        </div>
    )
}

export default Notifier