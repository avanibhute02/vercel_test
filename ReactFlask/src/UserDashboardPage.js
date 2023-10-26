import React, { useState } from 'react';
import './Dashboard.css';
// import './App.css'

//import Button from '@mui/material/Button';
//import TextField from '@mui/material/TextField';


const darkOrange = '#FF8C00';



function ProjectsList({ projects }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1>Projects</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {projects.map((project, index) => (
          <ProjectComponent
            key={index}
            project={project}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectComponent({ project }) {
  const [isJoin, setStatus] = useState(project.status);
  const joinText = isJoin ? "Leave" : "Join";

  const changeJoinState = () => {
    const newStatus = !isJoin;
    setStatus(newStatus);
  };

  return (
    <div className="bigbox" style={{
      backgroundColor: isJoin ? '#52a86b' : '',
      border: `5px solid ${darkOrange}`,
      borderRadius: '5px',
      padding: '10px',
      maxWidth: '50%',
      overflow: 'auto',
    }}>
      <h2 className="spaces">Project Name {project.Name}</h2>
      <p className="spaces">{project.users.join(", ")}</p>
      <div>
        {project.setNames.map((setName, index) => (
          <HardwareSet
            key={index}
            name={setName}
            capacity={project.cap[index]}
            available={project.sets[index]}
            isJoin={isJoin}
            project={project.Name}
          />
        ))}
      </div>
        <button onClick={changeJoinState}>{joinText}</button>
      {/*<Button*/}
      {/*  sx={{ m: 2, backgroundColor: darkOrange, '&:hover': { backgroundColor: '#e57a00' } }}*/}
      {/*  variant="contained"*/}
      {/*  onClick={changeJoinState}*/}
      {/*>*/}
      {/*  {joinText}*/}
      {/*</Button>*/}
    </div>
  );
}

function HardwareSet({ name, capacity, available, isJoin, project }) {
  const [error, setError] = useState(false);
  const [txtvalue, setValue] = useState("");
  const [availableState, setAvailableState] = useState(parseInt(available, 10));

  const CheckIn = (val, name) => {
    if (val) {
      const parsedVal = parseInt(val, 10);
      if (!isNaN(parsedVal) && parsedVal > 0) {
        const newAvailable = availableState + parsedVal;
        setAvailableState(newAvailable <= available ? newAvailable : available);


        var fetchURL="/checkin/" + ' '+project+' '+val.toString()+' '+name
        fetch(fetchURL)

        .then((response) => response.text())
        .then(function(data) {
          data = JSON.parse(data);

          if (data.code === 200) {
            setError(false);
          } else {
            setError(true);
          }


        })
      }
    }
  };

  const CheckOut = (val, name) => {
    if (val) {
      const parsedVal = parseInt(val, 10);
      if (!isNaN(parsedVal) && parsedVal > 0) {
        const newAvailable = availableState - parsedVal;
        setAvailableState(newAvailable >= 0 ? newAvailable : 0);

        var fetchURL="/checkout/" + ' '+project+' '+val.toString()+' '+name
        fetch(fetchURL)

        .then((response) => response.text())
        .then(function(data) {
          data = JSON.parse(data);

          if (data.code === 200) {
            setError(false);
          } else {
            setError(true);
          }
        })
      }
    }
  };

  return (
    <div className="flexbox-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <h3>{name}: {availableState}/{capacity}</h3>
        <input
          type="text"
          value={txtvalue}
          onChange={(e) => { setValue(e.target.value); }}
          id="amount"
          // name="amount"
          placeholder="Amount"
        />
      {/*<TextField*/}
      {/*  sx={{ m: 2, width: '200px' }}*/}
      {/*  id="outlined-basic"*/}
      {/*  label="Enter Quantity"*/}
      {/*  variant="outlined"*/}
      {/*  value={txtvalue}*/}
      {/*  onChange={(e) => { setValue(e.target.value); }}*/}
      {/*/>*/}
        <button onClick={(e) => { CheckIn(txtvalue,name); }} disabled={!isJoin}>Check In</button>
        <button onClick={(e) => { CheckOut(txtvalue,name); }} disabled={!isJoin}>Check Out</button>
      {/*<Button*/}
      {/*  sx={{ m: 2, backgroundColor: darkOrange, '&:hover': { backgroundColor: '#e57a00' } }}*/}
      {/*  onClick={(e) => { CheckIn(txtvalue); }}*/}
      {/*  variant="contained"*/}
      {/*  disabled={!isJoin}*/}
      {/*>*/}
      {/*  Check In*/}
      {/*</Button>*/}
      {/*<Button*/}
      {/*  sx={{ m: 2, backgroundColor: darkOrange, '&:hover': { backgroundColor: '#e57a00' } }}*/}
      {/*  onClick={(e) => { CheckOut(txtvalue); }}*/}
      {/*  variant="contained"*/}
      {/*  disabled={!isJoin}*/}
      {/*>*/}
      {/*  Check Out*/}
      {/*</Button>*/}
    </div>
  );
}

function App() {
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [users, setUsers] = useState([""]);


  var fetchURL="/setup/"
        fetch(fetchURL)

        .then((response) => response.text())
        .then(function(data) {
          data = JSON.parse(data);


          if (data.code === 200) {
            setError(false);
            setName(data.info.name)
            // setUsers(data.info.users)
          } else {
            setError(true);
          }
        })
    // data.name="hello"



  const projects = [
    {
      Name: name,
      users: ["sophia", "steve"],
      status: false,
      setNames: ["hw1", "hw2"],
      sets: ["50", "0"],
      cap: ["100", "100"]
    },
      {
      Name: "2",
      users: ["neal", "anish"],
      status: false,
      setNames: ["hw1", "hw2"],
      sets: ["50", "0"],
      cap: ["100", "100"]
    }
  ];

  return (
      // <div>{name}
      <ProjectsList projects={projects} />
      // </div>
        );

}

export default App;
