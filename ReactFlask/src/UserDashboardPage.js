import React, { useState } from 'react';
import './App.css';

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
            available={project.cap[index]}
            isJoin={isJoin}
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

function HardwareSet({ name, available, isJoin }) {
  const [txtvalue, setValue] = useState("");
  const [availableState, setAvailableState] = useState(parseInt(available, 10));

  const CheckIn = (val) => {
    if (val) {
      const parsedVal = parseInt(val, 10);
      if (!isNaN(parsedVal) && parsedVal > 0) {
        const newAvailable = availableState + parsedVal;
        setAvailableState(newAvailable <= available ? newAvailable : available);
      }
    }
  };

  const CheckOut = (val) => {
    if (val) {
      const parsedVal = parseInt(val, 10);
      if (!isNaN(parsedVal) && parsedVal > 0) {
        const newAvailable = availableState - parsedVal;
        setAvailableState(newAvailable >= 0 ? newAvailable : 0);
      }
    }
  };

  return (
    <div className="flexbox-container" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <h3>{name}: {availableState}/{available}</h3>
        <input
          type="text"
          value={txtvalue}
          onChange={(e) => { setValue(e.target.value); }}
          id="amount"
          name="amount"
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
        <button onClick={(e) => { CheckIn(txtvalue); }} disabled={!isJoin}>Check In</button>
        <button onClick={(e) => { CheckOut(txtvalue); }} disabled={!isJoin}>Check Out</button>
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
  const projects = [
    {
      Name: "1",
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

  return <ProjectsList projects={projects} />;
}

export default App;
