import React, {useState} from 'react';
import './ResourceManagementWelcomePage.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



export default function App(){
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state && location.state.username;
  const [id, setID] = useState(''); //input
  const [projectID, setProjectID] = useState(''); //input
  const [names, setNames] = useState(''); //input
  const [available, setAvailable] = useState(''); //input
  const [message, setMessage] = useState(''); //input
  const [showPopup, setShowPopup] = useState(false);
  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };
  const handleNext = (e) => {
    navigate('/dashboard', {state: {username}});

  };

  const handleID = (e) => {
	setID(e.target.value);
  };
  const handleSetNames = (e) => {
	setNames(e.target.value);
  };
  const handleAvailable = (e) => {
	setAvailable(e.target.value);
  };
  const handleProjectID = (e) => {
	setProjectID(e.target.value);
  };



  const handleCreate = (e) => {
      e.preventDefault();
      if ((id === '' )||(names==='')||(available==='')) {
       setMessage("Fill All Fields")
        openPopup()
      } else {

    var fetchURL="/create-project/" + id+'/'+names+'/'+available+'/'+username
    fetch(fetchURL)

    .then((response) => response.text())

    .then(function(data){

        data=JSON.parse(data);
        if(data.code === 200){
          setMessage("Project Successfully Created")
          openPopup()
        }
        if(data.code === 404){
          setMessage(data.message)
          openPopup()
        }

    })
    .catch(function (error){
    });

      }
  };

  const handleJoin = (e) => {
      e.preventDefault();
      if (projectID === '' ){
        setMessage("Enter Project ID")
        openPopup()
       //popup error
      } else {

    var fetchURL="/join-project/" +projectID+'/'+username
    fetch(fetchURL)

    .then((response) => response.text())
    .then(function(data){
        data=JSON.parse(data);
        if(data.code === 200){
          setMessage(projectID+ " Successfully Joined")
          openPopup()
        }
        if(data.code === 404){
          setMessage(data.message)
          openPopup()
        }

    })
    .catch(function (error){
    });

      }
  };



  return (
    <div className="container">
      <h1>Welcome User</h1>
      <div className="project-section">
        <div className="new-project">
          <h2>Create New Project</h2>
          <label>Project ID:</label>
          <input id = "id" onChange={handleID} type="text" />
          <label>Set Names:</label>
          <input id = "setNames" onChange={handleSetNames} type="text" />
          <label>Available Per Set:</label>
          <input id = "available" onChange={handleAvailable} type="text" />
          <button onClick={handleCreate}>Create</button>
        </div>
        {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closePopup}>
              &times;
            </span>
            <p>{message}</p>
          </div>
        </div>
      )}
        <div className="existing-project">
          <h2>Join Existing Project:</h2>
          <label>Project ID:</label>
          <input id = "projectID" onChange={handleProjectID} type="text" />
          <button onClick={handleJoin}>Search</button>
        </div>
      </div>
      <button onClick={handleNext} className="next-button">Next</button>
    </div>
  );
}


