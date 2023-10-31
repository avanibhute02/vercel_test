import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Dashboard.css';
// import './App.css'


const darkOrange = '#FF8C00';



function ProjectsList({ projects, username}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1>Projects</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {projects.map((project, index) => (
          <ProjectComponent
            key={index}
            project={project}
            username= {username}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectComponent({ project,username}) {

  const [isJoin, setStatus] = useState(project.status);
  const joinText = isJoin ? "Leave" : "Join";

  const changeJoinState = () => {
    const newStatus = !isJoin;
    if(newStatus===true){
      var fetchURL="/join/"+username+"/"+project.Name
        fetch(fetchURL)

        .then((response) => response.text())
        .then(function(data) {
          data = JSON.parse(data);

        })

    }else{
      var fetchURL="/leave/"+username+"/"+project.Name
        fetch(fetchURL)

        .then((response) => response.text())
        .then(function(data) {
          data = JSON.parse(data);

        })

    }
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
            // available={project.sets[index]}
            available= {project.sets[index]}
            isJoin={isJoin}
            project={project.Name}
          />
        ))}
      </div>
        <button onClick={changeJoinState}>{joinText}</button>

    </div>
  );
}

function HardwareSet({ name, capacity, available, isJoin, project }) {
  const [error, setError] = useState(false);
  const [flag, setFlag] = useState(0);
  const [txtvalue, setValue] = useState("");
  const [availableState, setAvailableState] = useState(parseInt(available));

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

  const initial = () => {
    setAvailableState(parseInt(available))
  }
  if(flag===0){
    initial();
    setFlag(1)
  }


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

        <button onClick={(e) => { CheckIn(txtvalue,name); }} disabled={!isJoin}>Check In</button>
        <button onClick={(e) => { CheckOut(txtvalue,name); }} disabled={!isJoin}>Check Out</button>

    </div>
  );
}


function App() {
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [flag, setFlag] = useState(0);
  const [flag2, setFlag2] = useState(0);
  const [joinedA, setJoinedA] = useState("");
  let joined = []
  const location = useLocation();
  const username = location.state && location.state.username;
  const [projects, setProjects]=useState([])


  const setup = () => {



    var fetchURL = "/setup/"+username
    fetch(fetchURL)

        .then((response) => response.text())
        .then(function (data) {
          data = JSON.parse(data);


          if (data.code === 200) {
            setError(false);
            setFlag(1)
            joined.push(data.joinedP)
            // setJoined(data.joinedP)
            let temp=[...projects];
            for(let i=0; i<joined.length; i++){
              var fetchURL="/projects/"+username+"/"+joined[i]
              fetch(fetchURL)

              .then((response) => response.text())
              .then(function(data1) {
                data1 = JSON.parse(data1);
                setJoinedA(data1)

                if (data1.code === 200) {
                  setError(false);
                  var newProject = {
                    Name: joined[i],
                    users: data1.info.users,
                    status: true,
                    setNames: data1.info.sets,
                    sets: data1.info.available,
                    cap: data1.info.cap
                    // Name: joined[i],
                    // users: data1.users,
                    // status: true,
                    // setNames: data1.sets,
                    // sets: data1.available,
                    // cap: data1.cap
                  };
                  // setProjects(prevProjects => [...prevProjects, ...newProject]);

                  temp.push(newProject);
                  setProjects(temp)
                  setJoinedA(0)
                  // projects.push(newProject)

                } else {
                  setError(true);
                }
              })
            }
          } else {
            setError(true);
          }
        })

  }
  if(flag===0) {
    setup();
  }



  // var projects = [
  //     {
  //     Name: "2",
  //     users: ["neal", "anish"],
  //     status: false,
  //     // part:false,
  //     setNames: ["hw1", "hw2"],
  //     sets: ["50", "0"],
  //     cap: ["100", "100"]
  //   }
  // ];

  return (
        <div>
          <ProjectsList projects={projects} username={username} />
       </div>
        );

}

export default App;
