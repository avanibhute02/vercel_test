import React, {useState} from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';


export default function LoginPage() {
    // Get the navigate function from the hook
  const navigate = useNavigate();
const [username, setUsername] = useState(''); //input
const [password, setPassword] = useState('');   //input
 const [rpassword, setRpassword] = useState(''); //backend

/*error is the boolean value we use as flag to display either an error response or success response
submitted is the boolean value we use to indicate if input was valid. It only works for empty string responses for now
these are also stateful values with setter methods
*/
const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState(false);
  const [message, setMessage] = useState(''); //input

/*This method handles the change of input

*/
    const goToSignUp = () => {
    navigate('/signup'); // Navigates to the '/signup' route
  };
    const goToDashboard = (username) => {
        navigate('/resource', {state: {username}})
    // navigate('/dashboard', {state: {username}}); // Navigates to the '/signup' route
  };
const handleUsername = (e) => {
	setUsername(e.target.value);
	setSubmitted(false);
};

const handlePassword = (e) => {
	setPassword(e.target.value);
	setSubmitted(false);
};
const [showPopup, setShowPopup] = useState(false);
  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };


/*This method triggers on submit. It calls the backend endpoint to get last name
The backend only accepts one input in any other case it returns a 404 with a custom error message

in case of a 200 we set seterror as false

*/

const handleSubmit = (e) => {
	e.preventDefault();
	if ((username === '' )||(password==='')) {
	setError(true);
	} else {
	setSubmitted(true);
  var fetchURL="/getPassword/" + username+' '+password
  fetch(fetchURL)

  .then((response) => response.text())
  .then(function(data){
      data=JSON.parse(data);

          if (data.code === 200) {
              setRpassword(data.password)
              setError(false);
              goToDashboard(username);
          } else {
              setError(true);
              setMessage(data.error)
              openPopup()
              setRpassword("response code: " + data.code + " and message received: " + data.error);
          }
      //}
  })
  .catch(function (error){
      setError(true);
      setRpassword("error: "+error.message);
  });

	}
};

/* We use this method when we get a 200 response


*/
const successMessage = () => {
	return (
    <>
	<div
		className="success"
		style={{
		display: submitted ? '' : 'none',
		}}>
		<p >Response from backend: "{rpassword}"</p>
	</div>
  </>
	);
};
/* we use this when we get a 404


*/
const errorMessage = () => {
	return (
	<div
		className="error"
		style={{
		display: error ? '' : 'none',
		}}>
		<p >Please enter a valid username</p>
	</div>
	);
};



    return (
        <div className="login-container">
            <div className="photo-section">
                {/* You can add an <img> tag here for the photo */}
            </div>
            <div className="form-section">
                <h1>Welcome</h1>
                <p>Sign in to continue</p>
                <div className="input-group">
                    <label>Username</label>
                    <input type="text" id = "username" onChange={handleUsername} placeholder="Enter your username" />
                </div>
                <div className="input-group">
                    <label>Password</label>
                    <input type="password" id = "password" onChange={handlePassword} placeholder="Enter your password" />
                </div>
                <div className="button-group">
                    <button onClick={handleSubmit}>Login</button>

                    <button onClick={goToSignUp}>Create Account</button>
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


            </div>
        </div>
    );
}
