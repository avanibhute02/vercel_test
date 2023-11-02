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
      <button className="next-button">Next</button>
    </div>
  );
}

export default App;