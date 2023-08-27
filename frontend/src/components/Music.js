import text from '../resources/text'

const Music = ({lan}) => {
    return(
        <div>
            <h2>
                {text.music[lan]}
            </h2>
        </div>
    )
}

export default Music