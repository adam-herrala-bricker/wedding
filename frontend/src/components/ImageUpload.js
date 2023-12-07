import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {uploadMedia} from '../reducers/mediaReducer';
import Notifier from './Notifier';

// NOTE: The name is a bit unfortunate,
// since we're using this to handle uploading audio files as well,
// and it could be easily expanded to handle video if needed
const ImageUpload = () => {
  const acceptedFiles = ['image/png', 'image/jpeg', 'audio/wav', 'audio/mp3'];
  const defaultFiles = [''];
  const [files, setFiles] = useState(defaultFiles);
  const dispatch = useDispatch();

  // event handlers
  const handleUpload = (event) => {
    event.preventDefault();

    const currentFiles = [...event.target.files]; // need to make an array
    setFiles(currentFiles);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    files.forEach(async (i) => {
      dispatch(uploadMedia(i));
    });
  };

  return (
    <div>
      <h2>Upload files</h2>
      <form onSubmit = {handleSubmit}>
        <input
          type = "file"
          id = "file"
          name = "adminUpload"
          accept = {acceptedFiles}
          encType = "multipart/form-data"
          multiple onChange = {handleUpload}/>
        <button type = 'submit'>submit</button>
      </form>
      <Notifier/>
    </div>);
};

export default ImageUpload;
