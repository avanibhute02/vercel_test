import React from 'react';
import './ResourceManagementWelcomePage.css';

function App() {
  return (
    <div className="container">
      <h1>Welcome User</h1>
      <div className="project-section">
        <div className="new-project">
          <h2>Create New Project</h2>
          <label>Project Name:</label>
          <input type="text" />
          <label>Description:</label>
          <input type="text" />
          <label>Project ID:</label>
          <input type="text" />
          <button>Create</button>
        </div>
        <div className="existing-project">
          <h2>Use Existing Project:</h2>
          <label>Project ID:</label>
          <input type="text" />
          <button>Search</button>
        </div>
      </div>
    </div>
  );
}

export default App;

import React from 'react';
import './App1.css';

function App() {
  return (
    <div className="container">
      <h1>Resource Management</h1>
      <div className="resource-section">

        <div className="resource-row">
          <div className="header">
            <span>Capacity</span>
          </div>
          <div className="header">
            <span>Available</span>
          </div>
          <div className="header">
            <span>Request</span>
          </div>
        </div>

        <div className="resource-row">
          <span>HW Set 1:</span>
          <input type="text" />
          <input type="text" />
          <input type="text" />
        </div>

        <div className="resource-row">
          <span>HW Set 2:</span>
          <input type="text" />
          <input type="text" />
          <input type="text" />
        </div>

        <div className="buttons">
          <button>Check In</button>
          <button>Check Out</button>
        </div>
      </div>
    </div>
  );
}

export default App;