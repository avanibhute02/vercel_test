import { useState } from 'react';

export default function Form() {

/*name holds user input and lastName handles output from server
these values are maintained as stateful with setter methods to keep them updated

*/
const [name, setName] = useState('');
const [lastname, setLastName] = useState('');

const [username, setUsername] = useState('');
const [password, setPassword] = useState('');


/*error is the boolean value we use as flag to display either an error response or success response
submitted is the boolean value we use to indicate if input was valid. It only works for empty string responses for now
these are also stateful values with setter methods
*/
const [submitted, setSubmitted] = useState(false);
const [error, setError] = useState(false);
/*This method handles the change of input

*/
const handleName = (e) => {
	setUsername(e.target.value);
	setSubmitted(false);
};



/*This method triggers on submit. It calls the backend endpoint to get last name
The backend only accepts one input in any other case it returns a 404 with a custom error message

in case of a 200 we set seterror as false

*/
const handleSubmit = (e) => {
	e.preventDefault();
	if (username === '' ) {
	setError(true);
	} else {
	setSubmitted(true);
  var fetchURL="/getPassword/" + username
  fetch(fetchURL)
  
  .then((response) => response.text())
  //.then((data) => console.log(data))
  .then(function(data){
    data=JSON.parse(data);

    if(data.code===200)
    {
    setPassword(data.password)
    setError(false);
    }
    else{
      setError(true);
      setPassword("response code: " + data.code + " and message recieved: " + data.error);
    }
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
		<p >Response from backend: "{password}"</p>
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
	<div className="form">
	<div>
		<h3>Enter Username.'</h3>
	</div>

	

	<form>
		{}
		<label id="lbl" className="label">Username: </label>
		<input id="inp" onChange={handleName} className="input"
		value={username} type="text" />

	



		<button onClick={handleSubmit} className="btn" type="submit" id="btn">
		Submit
		</button>
	</form>
  <div className="messages">
		{errorMessage()}
		{successMessage()}
	</div>
	</div>
);
}